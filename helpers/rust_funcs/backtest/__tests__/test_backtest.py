from typing import Dict
from django.test import SimpleTestCase
from unittest.mock import patch, Mock

from helpers.prices.data import FakeData, InvestPySource

from ..fixedweight import (
    FixedSignalBackTestWithPriceAPI,
)
from ..base import (
    BackTestUnusableInputException,
    BackTestInvalidInputException,
)
from ..static import StaticPortfolioBackTest
from api.models import Coverage


class TestStaticBackTest(SimpleTestCase):
    def setUp(self):
        self.weights = [[0.1, 0.9], [0.9, 0.1]]
        self.rets = [[20.0, 20.0], [10.0, 10.0]]
        return

    def test_that_it_can_init(self):
        s1 = StaticPortfolioBackTest(self.weights, self.rets)
        s1.run()
        self.assertTrue(True)

    def test_throws_error_when_returns_are_misshaped(self):
        rets_too_short = [[20.0]]
        self.assertRaises(
            BackTestInvalidInputException,
            StaticPortfolioBackTest,
            self.weights,
            rets_too_short,
        )

        rets_too_long = [[20.0, 20.0], [20.0, 20.0], [20.0, 20.0]]
        self.assertRaises(
            BackTestInvalidInputException,
            StaticPortfolioBackTest,
            self.weights,
            rets_too_long,
        )

    def test_that_portfolio_stats_are_calculated(self):
        s1 = StaticPortfolioBackTest(self.weights, self.rets)
        s1.run()
        self.assertEquals([round(i, 2) for i in s1.results["returns"]], [20.0, 10.0])

        self.assertEquals(s1.results["mdd"], 0)
        rets = [[20.0, 20.0], [-10.0, -50.0], [10.0, -10.0]]
        weights = [[0.4, 0.6], [0.3, 0.7], [0.6, 0.4]]
        s2 = StaticPortfolioBackTest(weights, rets)
        s2.run()
        self.assertEquals(s2.results["mdd"], -38.0)

        self.assertEquals(round(s1.results["vol"]), 5.0)
        self.assertEquals(round(s1.results["cagr"]), 32.0)

    def test_that_maxdd_threshold_position_calculates(self):
        rets = [
            [20.0, 20.0],
            [-10.0, -50.0],
            [10.0, -10.0],
            [60.0, 60.0],
            [-50.0, -50.0],
            [10.0, 10.0],
            [10.0, 10.0],
            [100.0, 100.0],
        ]
        weights = [
            [0.4, 0.6],
            [0.3, 0.7],
            [0.6, 0.4],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
        ]
        s1 = StaticPortfolioBackTest(weights, rets)
        s1.run()
        res = s1.get_max_dd_threshold_position(-0.2)

        self.assertEquals((2.0, 4.0), res[0][:2])
        self.assertEquals((5.0, 8.0), res[1][:2])
        return


class TestFixedSignalBackTestWithPriceAPI(SimpleTestCase):
    def setUp(self):
        self.data: Dict[int, InvestPySource] = {}
        self.data[0] = FakeData.get_investpy(1, 0.01, 100)
        self.data[1] = FakeData.get_investpy(2, 0.02, 100)
        return

    @patch("helpers.rust_funcs.backtest.fixedweight.Coverage")
    @patch("helpers.rust_funcs.backtest.fixedweight.prices.PriceAPIRequests")
    def test_that_errors_from_investpy_are_handled(self, mock_price, mock_coverage):

        fake_query = []
        fake_query.append(Coverage(id=0, ticker="SPY"))
        fake_query.append(Coverage(id=1, ticker="CAC"))

        mock = Mock()
        mock.filter.return_value = fake_query
        mock_coverage.objects = mock

        mock1 = Mock()
        mock1.get.side_effect = ValueError("foo")
        mock_price.return_value = mock1
        self.assertRaises(
            BackTestUnusableInputException,
            FixedSignalBackTestWithPriceAPI,
            [1, 2],
            [0.5, 0.5],
        )

        mock1.get.side_effect = ConnectionError("foo")
        self.assertRaises(
            ConnectionError, FixedSignalBackTestWithPriceAPI, [1, 2], [0.5, 0.5]
        )

        mock1.get.side_effect = IndexError("foo")
        self.assertRaises(
            BackTestUnusableInputException,
            FixedSignalBackTestWithPriceAPI,
            [1, 2],
            [0.5, 0.5],
        )

        mock1.get.side_effect = RuntimeError("foo")
        self.assertRaises(
            BackTestUnusableInputException,
            FixedSignalBackTestWithPriceAPI,
            [1, 2],
            [0.5, 0.5],
        )
        return

    @patch("helpers.rust_funcs.backtest.fixedweight.Coverage")
    @patch("helpers.rust_funcs.backtest.fixedweight.prices.PriceAPIRequests")
    def test_that_throws_error_with_valid_but_bad_input(
        self, mock_price, mock_coverage
    ):
        mock = Mock()

        fake_query = []

        mock.filter.return_value = fake_query
        mock_coverage.objects = mock

        mock1 = Mock()
        mock1.get.return_value = self.data
        mock_price.return_value = mock1

        assets = [3, 4]
        weights = [0.5, 0.5]
        """ This tests for the user querying assets which aren't in the database Coverage"""
        self.assertRaises(
            BackTestUnusableInputException,
            FixedSignalBackTestWithPriceAPI,
            assets,
            weights,
        )

        fake_query.append(Coverage(id=0, ticker="SPY"))
        fake_query.append(Coverage(id=1, ticker="CAC"))

        assets1 = [1, 2]
        weights1 = [0.5, 0.5]
        mock1.get.return_value = []
        mock_price.return_value = mock1
        """ This tests for the user querying assets for which there is a Coverage object but
        which have no data for some reason
        """
        self.assertRaises(
            BackTestUnusableInputException,
            FixedSignalBackTestWithPriceAPI,
            assets,
            weights,
        )
        return

    @patch("helpers.rust_funcs.backtest.fixedweight.Coverage")
    @patch("helpers.rust_funcs.backtest.fixedweight.prices.PriceAPIRequests")
    def test_that_throws_error_when_missing_assets_or_weights(
        self, mock_price, mock_coverage
    ):
        mock = Mock()

        fake_query = []
        fake_query.append(Coverage(id=0, ticker="SPY"))
        fake_query.append(Coverage(id=1, ticker="CAC"))

        mock.filter.return_value = fake_query
        mock_coverage.objects = mock

        mock1 = Mock()
        mock1.get.return_value = self.data
        mock_price.return_value = mock1

        assets = []
        weights = []
        self.assertRaises(
            BackTestInvalidInputException,
            FixedSignalBackTestWithPriceAPI,
            assets,
            weights,
        )

        assets1 = [1, 2]
        weights1 = []
        self.assertRaises(
            BackTestInvalidInputException,
            FixedSignalBackTestWithPriceAPI,
            assets1,
            weights1,
        )

        assets2 = []
        weights2 = [0.5, 0.5]
        self.assertRaises(
            BackTestInvalidInputException,
            FixedSignalBackTestWithPriceAPI,
            assets2,
            weights2,
        )

        assets3 = [1]
        weights3 = [0.5, 0.5]
        self.assertRaises(
            BackTestInvalidInputException,
            FixedSignalBackTestWithPriceAPI,
            assets3,
            weights3,
        )
        return

    @patch("helpers.rust_funcs.backtest.fixedweight.Coverage")
    @patch("helpers.rust_funcs.backtest.fixedweight.prices.PriceAPIRequests")
    def test_that_it_can_init(self, mock_price, mock_coverage):
        mock = Mock()

        fake_query = []
        fake_query.append(Coverage(id=0, ticker="SPY"))
        fake_query.append(Coverage(id=1, ticker="CAC"))

        mock.filter.return_value = fake_query
        mock_coverage.objects = mock

        mock1 = Mock()
        mock1.get.return_value = self.data
        mock_price.return_value = mock1

        assets = [0, 1]
        weights = [0.5, 0.5]

        bt = FixedSignalBackTestWithPriceAPI(assets, weights)
        bt.run()
        self.assertTrue(bt.results["mdd"])
        self.assertTrue(bt.results["vol"])
        self.assertTrue(bt.results["cagr"])
        self.assertTrue(bt.results["sharpe"])
        return
