from typing import List, Type, TypeVar, Union
import datetime
import pandas as pd
import numpy as np
import numpy.typing as npt


class FactorSource:
    def get_length(self) -> int:
        return len(self.data)

    def get_dates(self) -> pd.Index:
        return self.data.index

    def get_prices(self) -> pd.DataFrame:
        return self.data

    def get_factors(self) -> npt.NDArray[np.str0]:
        return self.data["factor"].unique()  # type: ignore

    def get_returns(self) -> pd.DataFrame:
        return self.data[["ret"]]

    def get_returns_list(self) -> npt.NDArray[np.float64]:
        return self.get_returns()["ret"].to_numpy(dtype=np.float64)  # type:ignore

    def __init__(self, df: pd.DataFrame):
        self.data: pd.DataFrame = pd.DataFrame({})
        if "period" not in df.columns:
            self.data = df
        else:
            df["period"] = pd.to_numeric(df["period"])
            df.set_index("period", inplace=True)
            self.data = df
        return


class InvestPySource:
    def get_length(self) -> int:
        return len(self.data)

    def get_dates(self) -> pd.Index:
        return self.data.index

    def get_prices(self) -> pd.DataFrame:
        return self.data[["Open", "Close"]]

    def get_returns(self) -> pd.DataFrame:
        return self.data[["daily_rt"]]

    def get_returns_list(self) -> npt.NDArray[np.float64]:
        return self.get_returns()["daily_rt"].to_numpy(dtype=np.float64)  # type: ignore

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
            self.data: pd.DataFrame = filtered  # type: ignore
            self.length: int = len(filtered)


DataSource = Union[FactorSource, InvestPySource]

T = TypeVar("T", bound=DataSource)


class SourceFactory:
    @staticmethod
    def find_dates(dates: List[pd.Timestamp], data: T, cls: Type[T]) -> DataSource:
        return cls(data.data.loc[dates])

    @staticmethod
    def find_index(
        start: pd.Timestamp, end: pd.Timestamp, data: T, cls: Type[T]
    ) -> DataSource:
        return cls(data.data.iloc[start:end])


class FakeData:
    @staticmethod
    def get_investpy(mean: float, stdev: float, length: int = 100) -> InvestPySource:
        dates: List[pd.Timestamp] = [
            pd.Timestamp((datetime.date(2000, 9, 30) + datetime.timedelta(days=i)))
            for i in range(length)
        ]

        idx = pd.Index(data=dates, name="Date")
        df = pd.DataFrame(
            {
                "Close": np.random.normal(mean, stdev, length),
                "Open": np.random.normal(mean, stdev, length),
            },
            index=idx,
        )
        return InvestPySource(df)

    @staticmethod
    def get_factor(mean: float, stdev: float, length: int = 100) -> FactorSource:
        factor_dates: List[int] = [
            pd.Timestamp(
                (datetime.date(2001, 9, 30) + datetime.timedelta(days=i))
            ).timestamp()
            for i in range(length)
        ]

        df = pd.DataFrame(
            {
                "factor": "Mkt",
                "ret": np.random.normal(mean, stdev, length),
                "name": "fake_factor",
                "period": factor_dates,
                "period_name": list([(str(i) + "fake_factor") for i in range(length)]),
            }
        )
        return FactorSource(df)
