from typing import Any, Dict, List
import os
import requests
from datetime import date
import investpy
import pandas as pd

from api.models import FactorReturns, Coverage
from .data import InvestPySource, FactorSource, DataSource


class PriceAPIRequestMonthly:
    def get(self) -> DataSource:
        ##Don't require transform for factor because they are
        ##already monthly
        res: DataSource = self.price_api.get()
        if self.coverage.security_type == "factor":
            return res
        else:
            res.convert_to_monthly()
            return res

    def __init__(self, coverage_obj: Coverage) -> None:
        self.coverage = coverage_obj
        self.price_api = PriceAPIRequest(coverage_obj)
        pass


class PriceAPIRequest:
    def get(self) -> DataSource:
        if self.coverage.security_type == "etf":
            return InvestPySource(
                PriceAPI.get_etf_price_history(
                    self.coverage.name, self.coverage.country_name
                )
            )

        elif self.coverage.security_type == "index":
            return InvestPySource(
                PriceAPI.get_index_price_history(
                    self.coverage.name, self.coverage.country_name
                )
            )

        elif self.coverage.security_type == "fund":
            return InvestPySource(
                PriceAPI.get_fund_price_history(
                    self.coverage.name, self.coverage.country_name
                )
            )

        elif self.coverage.security_type == "stock":
            return InvestPySource(
                PriceAPI.get_stock_price_history(
                    self.coverage.ticker, self.coverage.country_name
                )
            )

        elif self.coverage.security_type == "factor":
            return FactorSource(FactorAPI.get_factor_price_history(self.coverage.name))
        else:
            raise ValueError("Unknown security type")

    def __init__(self, coverage_obj: Coverage):
        self.coverage: Coverage = coverage_obj


class PriceAPIRequestsMonthly:
    def get(self) -> Dict[int, DataSource]:
        return {int(i.id): j.get() for i, j in zip(self.coverage, self.requests)}

    def __init__(self, coverage_objs: List[Coverage]):
        self.coverage: List[Coverage] = coverage_objs
        self.requests: List[PriceAPIRequestMonthly] = [
            PriceAPIRequestMonthly(i) for i in coverage_objs
        ]


class PriceAPIRequests:
    def get(self) -> Dict[int, DataSource]:
        return {int(i.id): j.get() for i, j in zip(self.coverage, self.requests)}

    def __init__(self, coverage_objs: List[Coverage]):
        self.coverage: List[Coverage] = coverage_objs
        self.requests: List[PriceAPIRequest] = [
            PriceAPIRequest(i) for i in coverage_objs
        ]


class FactorAPI:
    @staticmethod
    def get_factor_price_history(name: str) -> pd.DataFrame:
        # Need to split off the factor
        split: List[str] = name.split("-")
        join_factor: str = "-".join(split[1:])
        res: List[FactorReturns] = FactorReturns.objects.filter(
            name=split[0], factor=join_factor
        )
        temp: List[Dict[Any, Any]] = [i.__dict__ for i in res]
        df: pd.DataFrame = pd.DataFrame(temp)
        return df


class PriceAPI:

    current_date: str = date.today().strftime("%d/%m/%Y")

    @staticmethod
    def get_etf_price_history(etf: str, country: str) -> pd.DataFrame:
        return investpy.get_etf_historical_data(
            etf=etf,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_index_price_history(index: str, country: str) -> pd.DataFrame:
        return investpy.get_index_historical_data(
            index=index,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_fund_price_history(fund: str, country: str) -> pd.DataFrame:
        return investpy.get_fund_historical_data(
            fund=fund,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_stock_price_history(security: str, country: str) -> pd.DataFrame:
        return investpy.get_stock_historical_data(
            stock=security,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )


class HermesAPI:

    base_url = "https://eodhistoricaldata.com/api"

    @staticmethod
    def get_daily_price(ticker: str) -> list:
        key = os.getenv("HERMES_APIKEY")
        req_url = HermesAPI.base_url + f"/eod/{ticker}?api_token={key}&fmt=json"
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def search(search: str) -> list:
        key = os.getenv("HERMES_APIKEY")
        req_url = HermesAPI.base_url + f"/search/{search}?api_token={key}"
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def get_earnings(ticker: str) -> list:
        key: str = os.getenv("HERMES_APIKEY")
        filter_str: str = "Earnings::Trend,Earnings::History"
        req_url = (
            HermesAPI.base_url
            + f"/fundamentals/{ticker}?api_token={key}&filter={filter_str}"
        )
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def get_holders(ticker: str) -> list:
        key: str = os.getenv("HERMES_APIKEY")
        filter_str: str = "Holders::Institutions,Holders::Funds"
        req_url = (
            HermesAPI.base_url
            + f"/fundamentals/{ticker}?api_token={key}&filter={filter_str}"
        )
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def get_summary(ticker: str) -> list:
        key: str = os.getenv("HERMES_APIKEY")
        filter_str: str = "General,Highlights,Valuation,SharesStats"
        req_url = (
            HermesAPI.base_url
            + f"/fundamentals/{ticker}?api_token={key}&filter={filter_str}"
        )
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def get_insider(ticker: str) -> list:
        key: str = os.getenv("HERMES_APIKEY")
        filter_str: str = "InsiderTransactions"
        req_url = (
            HermesAPI.base_url
            + f"/fundamentals/{ticker}?api_token={key}&filter={filter_str}"
        )
        res = requests.get(req_url)
        return res.json()

    @staticmethod
    def get_fundamentals(ticker: str) -> list:
        key: str = os.getenv("HERMES_APIKEY")
        filter_str: str = "Financials::Balance_Sheet::yearly,Financials::Income_Statement::yearly,Financials::Cash_Flow::yearly"
        req_url = (
            HermesAPI.base_url
            + f"/fundamentals/{ticker}?api_token={key}&filter={filter_str}"
        )
        res = requests.get(req_url)
        return res.json()
