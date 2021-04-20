from datetime import date
from datetime import datetime
import investpy
import pandas as pd

from api.models import FactorReturns
from .data import InvestPySource, FactorSource


class PriceAPIRequests:
    def get(self):
        return {
            int(i.id): j.get()
            for i, j in zip(self.coverage, self.requests)
        }

    def __init__(self, coverage_objs):
        self.coverage = coverage_objs
        self.requests = [PriceAPIRequest(i) for i in coverage_objs]
        return


class PriceAPIRequest:
    def get(self):
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
            return FactorSource(
                FactorAPI.get_factor_price_history(self.coverage.name)
            )
        else:
            raise ValueError("Unknown security type")
        return

    def __init__(self, coverage_obj):
        self.coverage = coverage_obj
        return


class FactorAPI:
    @staticmethod
    def get_factor_price_history(name):
        # Need to split off the factor
        split_name = name.split("-")[0]
        res = FactorReturns.objects.filter(name=split_name)
        temp = [i.__dict__ for i in res]
        df = pd.DataFrame(temp)
        return df


class PriceAPI:

    current_date = date.today().strftime("%d/%m/%Y")

    @staticmethod
    def get_etf_price_history(etf, country):
        return investpy.get_etf_historical_data(
            etf=etf,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_index_price_history(index, country):
        return investpy.get_index_historical_data(
            index=index,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_fund_price_history(fund, country):
        return investpy.get_fund_historical_data(
            fund=fund,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )

    @staticmethod
    def get_stock_price_history(security, country):
        return investpy.get_stock_historical_data(
            stock=security,
            country=country,
            from_date="01/01/1970",
            to_date=PriceAPI.current_date,
        )
