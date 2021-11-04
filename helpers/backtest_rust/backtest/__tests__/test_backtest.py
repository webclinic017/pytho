from typing import Dict
from django.test import TestCase
from unittest.mock import patch, Mock

from helpers.prices.data import FakeData, InvestPySource

from ..fixedweight import (
    FixedSignalBackTestWithPriceAPI,
    BackTestUnusableInputException,
    BackTestInvalidInputException,
)
from api.models import Coverage


class TestFixedSignalBackTestWithPriceAPI(TestCase):
    def setUp(self):
        self.data: Dict[int, InvestPySource] = {}
        self.data[0] = FakeData.get_investpy(1, 0.01, 100)
        self.data[1] = FakeData.get_investpy(2, 0.02, 100)
        return
        
    @patch("helpers.backtest_rust.backtest.fixedweight.Coverage")
    @patch("helpers.backtest_rust.backtest.fixedweight.prices.PriceAPIRequests")
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

    @patch("helpers.backtest_rust.backtest.fixedweight.Coverage")
    @patch("helpers.backtest_rust.backtest.fixedweight.prices.PriceAPIRequests")
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

    @patch("helpers.backtest_rust.backtest.fixedweight.Coverage")
    @patch("helpers.backtest_rust.backtest.fixedweight.prices.PriceAPIRequests")
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

    @patch("helpers.backtest_rust.backtest.fixedweight.Coverage")
    @patch("helpers.backtest_rust.backtest.fixedweight.prices.PriceAPIRequests")
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
        self.assertTrue(bt.results["max_drawdown"])
        self.assertTrue(bt.results["vol"])
        self.assertTrue(bt.results["cagr"])
        self.assertTrue(bt.results["sharpe"])
        return
