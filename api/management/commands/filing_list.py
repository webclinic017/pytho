from datetime import date, datetime
import requests
import zipfile
import io
import sqlite3
import time
import os

ROOT_URL = "https://www.sec.gov/Archives/edgar/full-index"
conn = sqlite3.connect("pytho.sqlite")
form_names = None
issuers = None


def build_url_paths():
    qts = ["QTR1", "QTR2", "QTR3", "QTR4"]
    base_year = 1995
    years = range(base_year, date.today().year + 1)
    paths = []
    for y in years:
        for q in qts:
            path = ROOT_URL + "/%s/%s/master.zip" % (y, q)
            paths.append(path)
    return paths


def get_file(path):
    print(path)
    r = requests.get(path, stream=True)
    success = False
    back_off = 0
    while not success:
        time.sleep(back_off)
        r = requests.get(path, stream=True, headers={"User-Agent": str(os.environ['SEC_USER_AGENT'])})
        if r.status_code == 200:
            success = True
        else:
            back_off += 2
            print(r.content)
            print(f"Backing off: {back_off}")
            if back_off > 200:
                exit()

    z = zipfile.ZipFile(io.BytesIO(r.content))
    contents = []
    with z.open("master.idx", "r") as myfile:
        contents.append(myfile.readlines())
    info = contents[0][12:]
    arg_buff = []
    for i in info:
        to_str = str(i)
        split_up = to_str.split("|")
        cik = int(split_up[0][2:])
        issuer = split_up[1]
        form_type = split_up[2]
        date = int(datetime.strptime(split_up[3], "%Y-%m-%d").timestamp())
        path = split_up[4].strip()[:-5]
        path_split = path.split("/")
        path_end = path_split[3][:-4]
        arg_buff.append((cik, issuer, form_type, date, path_end))

    print("Started building queries...")

    insert_issuer_values = [issuer_build(*args) for args in arg_buff]
    insert_issuer = f"INSERT INTO api_secissuerid(issuer_id, issuer_name) VALUES"
    insert_issuer += ",".join(insert_issuer_values)
    insert_issuer += "on conflict do nothing;"

    print("Insert issuers...")
    cur = conn.cursor()
    cur.execute(insert_issuer)
    conn.commit()
    print("Finished issuers")

    insert_q_values = [into_db(*args) for args in arg_buff]
    base_insert = (
        "INSERT INTO api_secfilingpaths(issuer_id, form_id, date, path) VALUES"
    )
    base_insert += ",".join(insert_q_values)
    base_insert += "on conflict do nothing;"

    print("Trying big insert")
    cur = conn.cursor()
    cur.execute(base_insert)
    conn.commit()
    print("Finished big insert")
    time.sleep(5)


def get_form_id(cur, form_type):
    get_q = f"select form_name, form_id from api_secformid"
    insert_q = f"INSERT INTO api_secformid(form_name) VALUES ('{form_type}');"
    global form_names
    global conn

    if not form_names:
        cur.execute(get_q)
        form_names = {i[0]: i[1] for i in cur.fetchall()}
    if form_type in list(form_names.keys()):
        return form_names[form_type]
    else:
        cur.execute(insert_q)
        conn.commit()
        form_names = None
        return get_form_id(cur, form_type)


def update_path(cur, cik, form_id, date, path):
    return f"({cik}, {form_id}, {date}, '{path}')"


def issuer_build(cik, issuer, form_type, date, path_end):
    issuer_mod = issuer.replace("'", "''")
    return f"({cik}, '{issuer_mod}')"


def into_db(cik, issuer, form_type, date, path_end):
    cur = conn.cursor()
    form_id = get_form_id(cur, form_type)
    return update_path(cur, cik, form_id, date, path_end)


paths = build_url_paths()
for p in paths:
    get_file(p)

conn.close()
