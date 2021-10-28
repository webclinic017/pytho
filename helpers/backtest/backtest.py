import pandas as pd
import pytz
from typing import List, Dict

from qstrader.alpha_model.fixed_signals import FixedSignalsAlphaModel
from qstrader.asset.universe.static import StaticUniverse
from qstrader.data.backtest_data_handler import BacktestDataHandler
from qstrader.trading.backtest import BacktestTradingSession
from qstrader.settings import set_print_events
from qstrader.statistics.json_statistics import JSONStatistics

from api.models import Coverage
from helpers import prices
from helpers.prices.data import DataSource

from .data import InvestPyDailyBarDataSource


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


class FixedSignalBackTestWithPriceAPI(BackTest):
    """Initialises and loads the data to be used by the backtest.

    Attributes
    ---------
    assets : `List[str]`
        List of assetids in string format prefixed with 'EQ:`
    weights : `List[float]`
        List of portfolio weights in decimal form.
    price_request : `prices.PriceAPIRequests`
        Object that determines how the request for a Coverage object is fulfilled

    Raises
    ---------
    BackTestInvalidInputException
        Either weights or assets is missing or not formatted
    BackTestUnusableInputException
        Input is valid but there is no data source
    ConnectionError
        Failed to connect to InvestPySource
    """

    def run(self) -> None:
        set_print_events(False)

        strategy_universe: StaticUniverse = StaticUniverse(self.assets)
        data_source: InvestPyDailyBarDataSource = InvestPyDailyBarDataSource(
            self.prices
        )
        data_handler: BacktestDataHandler = BacktestDataHandler(
            strategy_universe, data_sources=[data_source]
        )

        strategy_alpha_model: FixedSignalsAlphaModel = FixedSignalsAlphaModel(
            self.signal
        )
        strategy_backtest: BacktestTradingSession = BacktestTradingSession(
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
        stats: JSONStatistics = JSONStatistics(
            strategy_backtest.get_equity_curve(),
            strategy_backtest.get_target_allocations(),
        )
        self.results = stats.statistics["strategy"]
        return

    def _init_price_request(self) -> None:
        self.price_request: prices.PriceAPIRequests = prices.PriceAPIRequests(
            self.coverage
        )
        return

    def _init_prices(self) -> None:
        self.prices: Dict[int, pd.DataFrame] = {}
        try:
            sources_dict: Dict[int, DataSource] = self.price_request.get()
        # Invalid Input
        except ValueError:
            raise BackTestUnusableInputException
        # Request failed to return 200 status code
        except ConnectionError:
            raise ConnectionError
        # Valid input but query could not produce result
        except RuntimeError:
            raise BackTestUnusableInputException
        # Information was unavailable or not found
        except IndexError:
            raise BackTestUnusableInputException

        else:
            for i in sources_dict:
                ##Always returns a dataframe
                prices: pd.DataFrame = sources_dict[i].get_prices()
                ##If we are missing data for any asset, we should stop
                if prices.empty:
                    raise BackTestUnusableInputException
                self.prices[i] = prices
            if not self.prices:
                raise BackTestUnusableInputException
        return

    def _init_assets(self) -> None:
        self.assets: List[str] = ["EQ:" + str(c.id) for c in self.coverage]
        self.signal: Dict[str, float] = {
            i: j for (i, j) in zip(self.assets, self.weights)
        }
        return

    def _init_data(self) -> None:
        self._init_assets()
        self._init_price_request()
        self._init_prices()
        self._init_start_and_end_date()
        return

    def __init__(self, assets: List[int], weights: List[float]):
        if not assets or not weights:
            raise BackTestInvalidInputException

        if len(assets) != len(weights):
            raise BackTestInvalidInputException

        self.weights: List[float] = weights
        try:
            self.coverage: List[Coverage] = Coverage.objects.filter(id__in=assets)
        except:
            raise BackTestUnusableInputException

        if len(self.coverage) != len(assets):
            raise BackTestUnusableInputException

        self._init_data()
        super().__init__(self.prices)
        return
