import requests
import zipfile
import pandas as pd
import numpy as np
import io


class FFDat:
    def dat_to_df(self, csv, headers=None):
        remove_header = csv.splitlines()[self.header_size :]
        remove_last = remove_header[:-1]
        rejoined = io.StringIO("\n".join(remove_last))
        df = pd.read_csv(
            rejoined, header=0, names=headers, delim_whitespace=True
        )
        return df


class FFCsv:
    def csv_to_df(self, csv):
        remove_header = csv.splitlines()[self.header_size :]
        remove_last = remove_header[:-1]
        rejoined = io.StringIO("\n".join(remove_last))
        df = pd.read_csv(rejoined)
        df.rename(columns={df.columns[0]: "period"}, inplace=True)
        return df


class FFRequest:
    __base = "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/"

    def get_files(self):
        file_names = self.z.namelist()
        return [self.z.read(i).decode() for i in file_names]

    def get_file(self):
        file_name = self.z.namelist()[self.file_loc]
        return self.z.read(file_name).decode()

    def init_zip(self):
        self.r = requests.get(FFRequest.__base + self.location)
        self.z = zipfile.ZipFile(io.BytesIO(self.r.content))
        return


class FlattenDf:
    def format_df(self, df):
        df["period"] = (
            (pd.to_datetime(df["period"], format=self.date_fmt)).astype(
                int
            )
            / 10 ** 9
        ).astype(int)
        df.set_index("period", inplace=True)
        df = pd.DataFrame(df.unstack(level=-1))
        df.reset_index(inplace=True)
        df.rename(columns={df.columns[0]: "factor"}, inplace=True)
        df.rename(columns={df.columns[2]: "ret"}, inplace=True)
        df["name"] = self.name
        df["period_name"] = (
            df["name"].astype("str")
            + df["period"].astype("str")
            + df["factor"]
        )
        df.dropna(inplace=True)

        if df["ret"].dtype == object:
            df["ret"] = df["ret"].astype("str")
            df["ret"] = df.apply(lambda r: r["ret"].strip(), axis=1)
            df["ret"] = df["ret"].astype("float64")
        return df


class FlattenDfAppendName(FlattenDf):
    def format_df_with_suffix(self, df, suffix):
        df = self.format_df(df)
        df["name"] = self.name + "_" + suffix
        df["period_name"] = df["period_name"] + "_" + suffix
        return df


class FFCommonBuildAlgo:
    def build(self):
        self.init_zip()
        raw_csv = self.get_file()
        df = self.csv_to_df(raw_csv)
        self.df = self.format_df(df)
        return


class FF3FactorDailyData(FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo):

    __name = "ff3factordaily"
    __location = "F-F_Research_Data_Factors_daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FF3FactorDailyData.__name
        self.location = FF3FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 4
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFDeveloped5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffdeveloped5factordaily"
    __location = "Developed_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFDeveloped5FactorDailyData.__name
        self.location = FFDeveloped5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFDevelopedExUs5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffdevelopedexus5factordaily"
    __location = "Developed_ex_US_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFDevelopedExUs5FactorDailyData.__name
        self.location = FFDevelopedExUs5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFEuropean5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffeuropean5factordaily"
    __location = "Europe_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFEuropean5FactorDailyData.__name
        self.location = FFEuropean5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFJapanese5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffjapanese5factordaily"
    __location = "Japan_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFJapanese5FactorDailyData.__name
        self.location = FFJapanese5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFAsiaPacificExJapan5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffasiapacificexjapan5factordaily"
    __location = "Asia_Pacific_ex_Japan_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFAsiaPacificExJapan5FactorDailyData.__name
        self.location = FFAsiaPacificExJapan5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFNorthAmerica5FactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffnorthamerica5factordaily"
    __location = "North_America_5_Factors_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFNorthAmerica5FactorDailyData.__name
        self.location = FFNorthAmerica5FactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFDevelopedMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffdevelopedmomentumfactordaily"
    __location = "Developed_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFDevelopedMomentumFactorDailyData.__name
        self.location = FFDevelopedMomentumFactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFDevelopedExUsMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffdevelopedexusmomentumfactordaily"
    __location = "Developed_ex_US_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFDevelopedExUsMomentumFactorDailyData.__name
        self.location = FFDevelopedExUsMomentumFactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFEuropeanMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffeuropeanmomentumfactordaily"
    __location = "Europe_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFEuropeanMomentumFactorDailyData.__name
        self.location = FFEuropeanMomentumFactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFJapaneseMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffjapanesemomentumfactordaily"
    __location = "Japan_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFJapaneseMomentumFactorDailyData.__name
        self.location = FFJapaneseMomentumFactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFAsiaPacificExJapanMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffasiapacificexjapanmomentumfactordaily"
    __location = "Asia_Pacific_ex_Japan_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFAsiaPacificExJapanMomentumFactorDailyData.__name
        self.location = (
            FFAsiaPacificExJapanMomentumFactorDailyData.__location
        )
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFNorthAmericaMomentumFactorDailyData(
    FFRequest, FFCsv, FlattenDf, FFCommonBuildAlgo
):

    __name = "ffnorthamericamomentumfactordaily"
    __location = "North_America_Mom_Factor_Daily_CSV.zip"

    def __init__(self):
        super().__init__()
        self.name = FFNorthAmericaMomentumFactorDailyData.__name
        self.location = FFNorthAmericaMomentumFactorDailyData.__location
        self.file_loc = 0
        self.header_size = 6
        self.date_fmt = "%Y%m%d"
        self.build()
        return


class FFInternationalCountriesMonthlyData(
    FFRequest, FFDat, FlattenDfAppendName
):

    """
    The formatting for this is terrible so we need to
    do a lot of extra work here
    """

    __name = "ffinternationalcountriesmonthly"
    __location = "F-F_International_Countries.zip"

    def __init__(self):
        super().__init__()
        self.name = FFInternationalCountriesMonthlyData.__name
        self.location = FFInternationalCountriesMonthlyData.__location
        self.header_size = 3
        self.date_fmt = "%Y%m"
        columns = [
            "period",
            "Mkt",
            "BE/MEHi",
            "BE/MELo",
            "E/PHi",
            "E/PLo",
            "CE/PHi",
            "CE/PLo",
            "YldHi",
            "YldLo",
            "YldZero",
        ]

        self.init_zip()
        df_buffer = []
        string = "     Value-Weight Local  Returns      All 4 Data Items Required"

        for i, j in enumerate(self.z.namelist()):
            self.file_loc = i
            raw_csv = self.get_file()
            filter_csv_buffer = []
            should_copy = False

            all_data = raw_csv.splitlines()
            for m, n in enumerate(all_data):
                if should_copy:
                    filter_csv_buffer.append(n)

                if not n:
                    if should_copy:
                        should_copy = False
                        break
                    else:
                        if all_data[m + 1] == string:
                            should_copy = True

            joined = "\n".join(filter_csv_buffer)
            df = self.dat_to_df(joined, headers=columns)
            df = self.format_df_with_suffix(df, j[:-4].strip())
            df_buffer.append(df)

        self.df = pd.concat(df_buffer)
        return
