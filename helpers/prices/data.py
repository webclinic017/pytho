import pandas as pd 

class DataSource:
    def yield_window(self):
        raise NotImplementedError()

    def get_dates(self):
        raise NotImplementedError()

    def get_prices(self):
        raise NotImplementedError()

    def find_dates(self):
        raise NotImplementedError()

    def get_returns(self):
        raise NotImplementedError()


class FactorSource(DataSource):
    def yield_window(self, window):
        for i in self.data:
            yield i

    def get_dates(self):
        return self.data.index

    def get_prices(self):
        return self.data

    def find_dates(self, dates):
        return FactorSource(self.data.loc[dates])

    def find_index(self, start, end):
        return FactorSource(self.data.iloc[start:end])

    def get_factors(self):
        return self.data["factor"].unique()

    def get_returns(self):
        return self.data["ret"]

    def __init__(self, df):
        if "period" not in df.columns:
            self.data = df
        else:
            df['period'] = pd.to_numeric(df['period'])
            df.set_index('period', inplace=True)
            self.data = df
        return


class InvestPySource(DataSource):
    def yield_window(self, window):
        for i in self.data:
            yield i

    def get_dates(self):
        return self.data.index

    def get_prices(self):
        return self.data[["Open", "Close"]]

    def get_returns(self):
        return self.data["daily_rt"]

    def find_dates(self, dates):
        return InvestPySource(self.data.loc[dates])

    def find_index(self, start, end):
        return InvestPySource(self.data.iloc[start:end])

    def __init__(self, df):
        if df is None:
            return []

        if "daily_rt" in df.columns:
            self.data = df
            return

        df.reset_index(inplace=True)
        df["daily_rt"] = round(df["Close"].pct_change(1) * 100, 3)
        df.dropna(inplace=True)
        date_fmt = "%d/%m/%Y"
        df["time"] = df["Date"].apply(lambda x: int(x.timestamp() * 1))
        filtered = df[["time", "daily_rt", "Open", "Close"]]
        filtered.set_index("time", inplace=True)
        self.data = filtered
        self.length = len(filtered)
        return
