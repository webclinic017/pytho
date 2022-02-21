from typing import TypedDict, List
from bs4 import BeautifulSoup as bs
from bs4.element import ResultSet
import requests
from datetime import datetime
import re
import os

from api.models import SecFilingPaths


class Position(TypedDict):
    title: str
    cusip: str
    value: int
    shares: int
    shares_type: str


class ThirteenFFetcher:
    def _fetch_primary(self):
        path = self.filing_path_obj.path
        url = f"https://sec.report/Document/{path}/primary_doc.xml"
        if not self.quiet:
            print(f"Requesting 13F Primary: {url}")
        r = self.client.get(url, headers=self.headers)
        soup = bs(r.text, "lxml")
        period_date_raw_date = soup.find("periodofreport").string
        date_fmt = "%m-%d-%Y"
        self.period_date = int(
            datetime.strptime(period_date_raw_date, date_fmt).timestamp()
        )
        return

    def _fetch_positions(self):
        if not self.quiet:
            print(f"Requesting 13F Data: {self.data_link}")
        r = self.client.get(self.data_link, headers=self.headers)
        self.data = r.text
        return

    def _fetch_document(self):
        ##This is a default as a safeguard, it will probably still fail if we can't
        ##find a link below
        self.data_link = (
            f"https://sec.report/Document/{self.filing_path_obj.path}/infotable.xml"
        )
        path = self.filing_path_obj.path
        url = f"https://sec.report/Document/{path}"
        if not self.quiet:
            print(f"Requesting 13F Document: {url}")
        r = self.client.get(url, headers=self.headers)
        self.document = bs(r.text, "html.parser")
        files = self.document.find("div", text=re.compile("Additional Files"))
        additional_rows = files.find_next_sibling("div").find_all("tr")
        for row in additional_rows:
            val = row.find("td")
            if not val:
                continue
            else:
                href = val.find("a")["href"]
                if href[-3:] == "xml":
                    self.data_link = href
        return

    def __init__(self, filing_path_obj: SecFilingPaths, quiet: bool = False):
        self.quiet = quiet
        self.issuer_id = filing_path_obj.issuer_id
        self.filing_date = filing_path_obj.date
        self.filing_path_obj = filing_path_obj
        self.client = requests.Session()
        self.headers = {"User-Agent": str(os.environ["SEC_USER_AGENT"])}
        self._fetch_document()
        self._fetch_primary()
        self._fetch_positions()


class ThirteenFParser:
    def _parse(self):
        self.positions: List[Position] = []
        for info_table in self.info_tables:
            position = Position(
                title=info_table.find(self.title_str).string,
                cusip=info_table.find(self.cusip_str).string,
                value=int(info_table.find(self.value_str).string),
                shares=int(info_table.find(self.shares_str).string),
                shares_type=info_table.find(self.shares_type_str).string,
            )
            self.positions.append(position)
        return

    def __init__(self, fetcher):
        self.fetcher = fetcher
        self.xml = bs(fetcher.data, "lxml")
        if self.xml.find("ns1:informationtable"):
            self.info_table_str = "ns1:infotable"
            self.title_str = "ns1:titleofclass"
            self.cusip_str = "ns1:cusip"
            self.value_str = "ns1:value"
            self.shares_str = "ns1:sshprnamt"
            self.shares_type_str = "ns1:sshprnamttype"
        else:
            self.info_table_str = "infotable"
            self.title_str = "titleofclass"
            self.cusip_str = "cusip"
            self.value_str = "value"
            self.shares_str = "sshprnamt"
            self.shares_type_str = "sshprnamttype"

        self.info_tables: ResultSet = self.xml.find_all(self.info_table_str)
        self._parse()

    def get_positions(self) -> List[Position]:
        return self.positions

    def get_filing_date(self) -> int:
        return self.fetcher.filing_date

    def get_period_date(self) -> int:
        return self.fetcher.period_date

    def get_issuer_id(self) -> int:
        return self.fetcher.issuer_id
