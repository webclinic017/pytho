from typing import List, TypeVar
import pandas as pd
import numpy as np


class DataSource:
    def get_length(self) -> int:
        raise NotImplementedError()

    def get_dates(self) -> pd.Index:
        raise NotImplementedError()

    def get_prices(self) -> pd.DataFrame:
        raise NotImplementedError()

    def find_dates(self, dates: List[pd.Timestamp]):
        raise NotImplementedError()

    def get_returns(self):
        raise NotImplementedError()

F = TypeVar('F', bound='FactorSource')

class FactorSource(DataSource):
    def get_length(self) -> int:
        return len(self.data)

    def get_dates(self) -> pd.Index:
        return self.data.index

    def get_prices(self) -> pd.DataFrame:
        return self.data

    def find_dates(self, dates: List[pd.Timestamp]) -> F:
        return FactorSource(self.data.loc[dates]) #type: ignore

    def find_index(self, start: pd.Timestamp, end: pd.Timestamp) -> F:
        return FactorSource(self.data.iloc[start:end]) #type: ignore 

    def get_factors(self) -> np.ndarray:
        return self.data["factor"].unique()

    def get_returns(self) -> np.ndarray:
        return self.data["ret"]

    def __init__(self, df: pd.DataFrame):
        self.data: pd.DataFrame = pd.DataFrame({})
        if "period" not in df.columns:
            self.data = df
        else:
            df["period"] = pd.to_numeric(df["period"])
            df.set_index("period", inplace=True)
            self.data = df
        return

I = TypeVar('I', bound='InvestPySource')

class InvestPySource(DataSource):
    def get_length(self) -> int:
        return len(self.data)

    def get_dates(self) -> pd.Index:
        return self.data.index

    def get_prices(self) -> pd.DataFrame:
        return self.data[["Open", "Close"]]

    def get_returns(self) -> np.ndarray:
        return self.data["daily_rt"]

    def find_dates(self, dates) -> I:
        return InvestPySource(self.data.loc[dates]) #type: ignore

    def find_index(self, start, end) -> I:
        return InvestPySource(self.data.iloc[start:end]) #type: ignore

    def __init__(self, df: pd.DataFrame):
        if "daily_rt" in df.columns:
            self.data: pd.DataFrame = df
            return
        else:
            df.reset_index(inplace=True)
            df["daily_rt"] = round(df["Close"].pct_change(1) * 100, 3)
            df.dropna(inplace=True)
            df["time"] = df["Date"].apply(lambda x: int(x.timestamp() * 1))
            filtered: pd.DataFrame = df[["time", "daily_rt", "Open", "Close"]]
            filtered.set_index("time", inplace=True)
            self.data: pd.DataFrame = filtered #type: ignore
            self.length: int = len(filtered)
