from typing import Any, Dict, List, Optional, Type, TypeVar, Union, TypedDict
import datetime
import pandas as pd
import numpy as np
import numpy.typing as npt
from enum import Enum


class HermesPeriod(Enum):
    INTRADAY = 1
    DAILY = 2
    WEEKLY = 3
    MONTHLY = 4
    QUARTERLY = 5
    YEARLY = 6


class HermesEarningsSource:
    def get(self) -> Any:
        print(self.json_fundamental)
        return

    def __init__(self, json_fundamental: Dict[Any, Any]):
        self.json_fundamental = json_fundamental
        return


class HermesFundamentalResponse(TypedDict):
    revenue: List[float]
    ebit: List[float]
    op_inc: List[float]
    net_inc: List[float]
    cash: List[float]
    net_wc: List[float]
    net_tang: List[float]
    tot_assets: List[float]
    st_debt: List[float]
    lt_debt: List[float]
    tot_debt: List[float]
    net_debt: List[float]
    tot_equity: List[float]
    chg_wc: List[float]
    cfo: List[float]
    capex: List[float]
    cff: List[float]
    chg_cash: List[float]
    dates: List[str]
    titles: Dict[str, Dict[str, str]]


FundiesStruct = Dict[str, Dict[str, Union[float, str]]]


class HermesFundamentalSource:
    date_fmt: str = "%Y-%m-%d"
    num_fmt: int = 1000000  ##1m

    titles: Dict[str, Dict[str, str]] = {
        "Income Stmt": {
            "revenue": "Revenue",
            "ebit": "EBIT",
            "op_inc": "Op Inc",
            "net_inc": "Net Inc",
        },
        "Balance Sht": {
            "cash": "Cash",
            "net_wc": "Net WC",
            "net_tang": "Net Tang",
            "tot_assets": "Tot Assets",
            "st_debt": "ST Debt",
            "lt_debt": "LT Debt",
            "tot_debt": "Tot Debt",
            "net_debt": "Net Debt",
            "tot_equity": "Tot Eq",
        },
        "Cash Flow Stmt": {
            "chg_wc": "Chg WC",
            "cfo": "CFO",
            "capex": "Capex",
            "cff": "CFF",
            "chg_cash": "Chg Cash",
        },
    }

    inc_names: list[str] = [
        "totalRevenue",
        "ebit",
        "operatingIncome",
        "netIncome",
    ]

    bal_names: list[str] = [
        "cash",
        "netWorkingCapital",
        "netTangibleAssets",
        "totalAssets",
        "shortTermDebt",
        "longTermDebt",
        "shortLongTermDebtTotal",
        "netDebt",
        "totalStockholderEquity",
    ]

    cash_names: list[str] = [
        "changeInWorkingCapital",
        "totalCashFromOperatingActivities",
        "capitalExpenditures",
        "totalCashFromFinancingActivities",
        "changeInCash",
    ]

    def _parse_dates(self, statement: FundiesStruct) -> List[float]:
        ##We can have multiple dates for one year of results, likely due to restatments
        ##and differences between prelim/annual reporting. For dates, we just want to
        ##display the first date to the user because that is the period end for the
        ##results
        res: List[float] = []
        last_year = -1
        for date in statement:
            curr_year = date[0:4]
            if last_year == curr_year:
                res[-1] = date
            else:
                res.append(date)
                last_year=curr_year
        return res

    def _parse_statement(
        self, statement: FundiesStruct, variable_names: List[str]
    ) -> List[List[float]]:
        res: List[List[float]] = []
        last_year = -1
        ##Problem here is that single years can have multiple rows of data,
        ##some of which may be none. This is likely due to restatements and
        ##differences between prelim/annual reporting.
        ##To get the right data we track the current year and add if we
        ##are missing that data.
        ##Note that algo for getting date is different because we use the period
        ##date which is the earliest date for a single year. So the data actually isn't
        ##strictly matched to the date shown to the user.
        for date in statement:
            curr_year: str = date[0:4]
            if curr_year == last_year:
                ##We have existing values, only replace missing
                existing_vals = res[-1]
                for pos, val in enumerate(existing_vals):
                    if not val:
                        missing_name = variable_names[pos]
                        val: Union[float, None] = statement[date][missing_name]
                        ## Edit res in place
                        if val:
                            existing_vals[pos] = (
                                float(val) / HermesFundamentalSource.num_fmt
                            )
                        else:
                            existing_vals[pos] = val
            else:
                temp: List[float] = []
                for name in variable_names:
                    val: Union[float, None] = statement[date][name]
                    if val:
                        temp.append(float(val) / HermesFundamentalSource.num_fmt)
                    else:
                        temp.append(val)
                res.append(temp)
                last_year = curr_year
        return list(zip(*res))

    def get(self) -> HermesFundamentalResponse:
        query = lambda x: f'Financials::{x}::yearly'
        inc_statement: FundiesStruct = self.json_fundamental[query("Income_Statement")]
        bal_statement: FundiesStruct = self.json_fundamental[query("Balance_Sheet")]
        cash_statement: FundiesStruct = self.json_fundamental[query("Cash_Flow")]

        dates: List[float] = self._parse_dates(inc_statement)
        parsed_inc = self._parse_statement(
            inc_statement, HermesFundamentalSource.inc_names
        )
        parsed_bal = self._parse_statement(
            bal_statement, HermesFundamentalSource.bal_names
        )
        parsed_cash = self._parse_statement(
            cash_statement, HermesFundamentalSource.cash_names
        )
        return HermesFundamentalResponse(
            revenue=parsed_inc[0],
            ebit=parsed_inc[1],
            op_inc=parsed_inc[2],
            net_inc=parsed_inc[3],
            cash=parsed_bal[0],
            net_wc=parsed_bal[1],
            net_tang=parsed_bal[2],
            tot_assets=parsed_bal[3],
            st_debt=parsed_bal[4],
            lt_debt=parsed_bal[5],
            tot_debt=parsed_bal[6],
            net_debt=parsed_bal[7],
            tot_equity=parsed_bal[8],
            chg_wc=parsed_cash[0],
            cfo=parsed_cash[1],
            capex=parsed_cash[2],
            cff=parsed_cash[3],
            chg_cash=parsed_cash[4],
            dates=dates,
            titles=HermesFundamentalSource.titles,
        )

    def __init__(self, json_fundamental: Dict[Any, Any], period: HermesPeriod):
        self.json_fundamental = json_fundamental
        self.period = period
        return


class HermesDailyResponse(TypedDict):
    dates: List[int]
    close: List[float]


class HermesPriceSource:

    daily_date_fmt = "%Y-%m-%d"
    intraday_date_fmt = ""

    def get(self) -> HermesDailyResponse:
        dates = []
        closes = []
        for row in self.json_price:
            ts = datetime.datetime.strptime(
                row["date"], HermesPriceSource.daily_date_fmt
            ).timestamp()
            dates.append(int(ts))
            closes.append(float(row["adjusted_close"]))
        return HermesDailyResponse(dates=dates, close=closes)

    def __init__(self, json_price: List, period: HermesPeriod):
        self.json_price = json_price
        self.period = period
        return


class FactorSource:
    def convert_to_monthly(self) -> None:
        ##Moves error into runtime, not ideal but anything else
        ##will require re-working more code
        raise NotImplementedError

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
    def convert_to_monthly(self) -> None:
        ##Non-idempotent
        self.data.index = pd.to_datetime(self.data.index, unit="s")
        df: pd.DataFrame = self.data.groupby(
            by=[self.data.index.year, self.data.index.month]
        ).last()
        df.index.set_names(["year", "month"], inplace=True)
        df.reset_index(inplace=True)
        df["ret"] = round(df["Close"].pct_change(1) * 100, 3)
        df["time"] = pd.to_datetime(
            df["year"].astype(str) + "-" + df["month"].astype(str), format="%Y-%m"
        )
        df["time"] = df["time"].apply(lambda x: int(x.timestamp() * 1))
        filtered: pd.DataFrame = df[["time", "ret", "Open", "Close"]].copy()
        filtered.set_index("time", inplace=True)
        filtered.dropna(inplace=True)
        self.data: pd.DataFrame = filtered
        return

    def get_length(self) -> int:
        return len(self.data)

    def get_dates(self) -> pd.Index:
        return self.data.index

    def get_prices(self) -> pd.DataFrame:
        return self.data[["Open", "Close"]]

    def get_returns(self) -> pd.DataFrame:
        return self.data[["ret"]]

    def get_returns_list(self) -> npt.NDArray[np.float64]:
        return self.get_returns()["ret"].to_numpy(dtype=np.float64)  # type: ignore

    def __init__(self, df: pd.DataFrame):
        if "ret" in df.columns:
            self.data: pd.DataFrame = df
            return
        else:
            df.reset_index(inplace=True)
            df["ret"] = round(df["Close"].pct_change(1) * 100, 3)
            df.dropna(inplace=True)
            df["time"] = df["Date"].apply(lambda x: int(x.timestamp() * 1))
            filtered: pd.DataFrame = df[["time", "ret", "Open", "Close"]]
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
    def get_investpy(
        mean: float, stdev: float, length: int = 100, seed: Optional[int] = None
    ) -> InvestPySource:
        if seed:
            np.random.seed(seed)

        dates: List[pd.Timestamp] = [
            pd.Timestamp(datetime.date(2000, 9, 1)) + pd.DateOffset(days=i)
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
    def get_factor(
        mean: float, stdev: float, length: int = 100, seed: Optional[int] = None
    ) -> FactorSource:
        if seed:
            np.random.seed(seed)

        factor_dates: List[int] = [
            (
                pd.Timestamp(datetime.date(2001, 9, 1)) + pd.DateOffset(months=i)
            ).timestamp()
            for i in range(length)
        ]

        df = pd.DataFrame(
            {
                "factor": "Mkt",
                "ret": np.random.normal(mean, stdev, length) * 100,
                "name": "fake_factor",
                "period": factor_dates,
                "period_name": list([(str(i) + "fake_factor") for i in range(length)]),
            }
        )
        return FactorSource(df)
