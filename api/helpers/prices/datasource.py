from datetime import date
from datetime import datetime
import investpy


class PriceAPIRequests:
    def get_price_history(self):
        return {
            int(i.id): j.get_price_history()
            for i, j in zip(self.coverage, self.requests)
        }

    def __init__(self, coverage_objs):
        self.coverage = coverage_objs
        self.requests = [PriceAPIRequest(i) for i in coverage_objs]


class PriceAPIRequest:
    def get_price_history(self):
        data = []
        if self.coverage.security_type == "etf":
            data = PriceAPI.get_etf_price_history(
                self.coverage.name, self.coverage.country_name
            )

        elif self.coverage.security_type == "index":
            data = PriceAPI.get_index_price_history(
                self.coverage.name, self.coverage.country_name
            )

        elif self.coverage.security_type == "fund":
            data = PriceAPI.get_fund_price_history(
                self.coverage.name, self.coverage.country_name
            )

        elif self.coverage.security_type == "stock":
            data = PriceAPI.get_stock_price_history(
                self.coverage.ticker, self.coverage.country_name
            )

        return PriceAPI.get_daily_returns(data)

    def __init__(self, coverage_obj):
        self.coverage = coverage_obj
        return


class PriceAPI:

    current_date = date.today().strftime("%d/%m/%Y")

    @staticmethod
    def get_daily_returns(df):
        if df is None:
            return []

        df.reset_index(inplace=True)
        df["daily_rt"] = round(df["Close"].pct_change(1) * 100, 3)
        df.dropna(inplace=True)
        date_fmt = "%d/%m/%Y"
        df["time"] = df["Date"].apply(lambda x: int(x.timestamp() * 1))
        filtered = df[["time", "daily_rt"]]
        filtered.set_index("time", inplace=True)
        return filtered.to_dict()

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
