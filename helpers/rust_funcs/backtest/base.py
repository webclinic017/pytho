from typing import List, Dict, TypedDict
import pandas as pd
import pytz


class BackTestInvalidInputException(Exception):
    """Throws when BackTest is missing key inputs needed
    to complete
    """

    def __init__(self) -> None:
        self.message = "Missing either assets or weights or lengths are different"


class BackTestUnusableInputException(Exception):
    """Throws when BackTest has valid inputs but those inputs
    can't be used to create a valid BackTest
    """

    def __init__(self) -> None:
        self.message = "Data input cannot create a valid backtest"


class BackTestResults(TypedDict):
    ret: float
    cagr: float
    vol: float
    mdd: float
    sharpe: float
    values: List[float]
    returns: List[float]


class BackTest:
    """Common functions for all Backtests

    Attributes
    --------
    start_date : `pd.Timestamp`
        The soonest of all the starting dates of the data sources
    end_date : `pd.Timestamp`
        The earliest of all the ending dates of the data sources
    """

    def _init_start_and_end_date(self) -> None:
        """
        Get the latest start value, and the
        earliest end value
        """
        temp: List[List[float]] = []
        for i in self.prices:
            prices_df: pd.DataFrame = self.prices[i]
            first: float = prices_df.index[0]
            last: float = prices_df.index[-1]
            temp.append([first, last])
        self.start_date: pd.Timestamp = pd.Timestamp(
            max([i[0] for i in temp]), unit="s", tz=pytz.UTC
        )
        self.end_date: pd.Timestamp = pd.Timestamp(
            min([i[1] for i in temp]), unit="s", tz=pytz.UTC
        )
        return

    def __init__(self, prices: Dict[int, pd.DataFrame]) -> None:
        self.prices: Dict[int, pd.DataFrame] = prices
