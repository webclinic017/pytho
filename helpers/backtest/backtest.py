import os

import pandas as pd
import pytz

from qstrader.alpha_model.fixed_signals import FixedSignalsAlphaModel
from qstrader.alpha_model.single_signal import SingleSignalAlphaModel
from qstrader.asset.universe.static import StaticUniverse
from qstrader.data.backtest_data_handler import BacktestDataHandler
from qstrader.trading.backtest import BacktestTradingSession
from qstrader.settings import set_print_events
from qstrader.statistics.json_statistics import JSONStatistics

from api.models import Coverage
from helpers import prices

from .data import InvestPyDailyBarDataSource

"""
import django
from django.conf import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "retirement.settings")
django.setup()

# Now this script or any imported module can use any part of Django it needs.
from api.models import FactorReturns
"""


class BackTest:
    def _init_start_and_end_date(self):
        """
        Get the latest start value, and the
        earliest end value
        """
        temp = []
        for i in self.returns:
            rets = self.returns[i]
            first = rets.index[0]
            last = rets.index[-1]
            temp.append([first, last])
        self.start_date = pd.Timestamp(
            max([i[0] for i in temp]), tz=pytz.UTC
        )
        self.end_date = pd.Timestamp(
            min([i[1] for i in temp]), tz=pytz.UTC
        )
        return


class FixedSignalBackTest:
    def run(self):
        set_print_events(False)

        strategy_universe = StaticUniverse(self.assets)
        data_source = InvestPyDailyBarDataSource(self.returns)
        data_handler = BacktestDataHandler(
            strategy_universe, data_sources=[data_source]
        )

        strategy_alpha_model = FixedSignalsAlphaModel(self.signal)
        strategy_backtest = BacktestTradingSession(
            self.start_date,
            self.end_date,
            strategy_universe,
            strategy_alpha_model,
            initial_cash=1e5,
            rebalance="end_of_month",
            long_only=True,
            cash_buffer_percentage=0.01,
            data_handler=data_handler,
        )
        strategy_backtest.run()
        stats = JSONStatistics(
            strategy_backtest.get_equity_curve(),
            strategy_backtest.get_target_allocations(),
        )
        self.results = stats.statistics["strategy"]
        return


class FixedSignalBackTestWithPriceAPI(FixedSignalBackTest, BackTest):
    def _init_price_request(self):
        if self.coverage and len(self.coverage) > 0:
            self.price_request = prices.PriceAPIRequests(self.coverage)
        else:
            raise ValueError("Assets not found or coverage missing")
        return

    def _init_returns(self):
        returns_data = self.price_request.get_price_history()
        self.returns = {
            i: j for i, j in zip(self.assets, returns_data.values())
        }
        return

    def _init_assets(self):
        self.assets = ["EQ:" + str(c.id) for c in self.coverage]
        self.signal = {i: j for (i, j) in zip(self.assets, self.weights)}
        return

    def _init_data(self):
        self._init_assets()
        self._init_price_request()
        self._init_returns()
        self._init_start_and_end_date()
        return

    def __init__(self, assets, weights):
        self.weights = weights
        self.coverage = Coverage.objects.filter(id__in=assets)
        self._init_data()
        return
