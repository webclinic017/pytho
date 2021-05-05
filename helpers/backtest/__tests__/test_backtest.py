import os
import pandas as pd
import json
from django.test import TestCase
from unittest.mock import patch, Mock

from ..backtest import (
    FixedSignalBackTestWithPriceAPI,
)
from api.models import Coverage
from helpers.prices import InvestPySource


class TestFixedSignalBackTestWithPriceAPI(TestCase):
    def setUp(self):
        self.data = {}
        assets = ["CAC", "SPY"]
        for j, a in enumerate(assets):
            path_from_base = "/__mock__/" + a + ".json"
            curr_dir = os.path.dirname(os.path.realpath(__file__))
            with open(curr_dir + path_from_base, "r") as f:
                df = pd.read_json(f.read())
                df.index.rename("Date", inplace=True)
                self.data[j] = InvestPySource(df)
        return

    @patch("helpers.backtest.backtest.Coverage")
    @patch("helpers.backtest.backtest.prices.PriceAPIRequests")
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

        assets = [1, 2]
        weights = [0.5, 0.5]

        bt = FixedSignalBackTestWithPriceAPI(assets, weights)
        bt.run()
        assert bt.results["max_drawdown"] is not None
        assert bt.results["annualised_vol"] is not None
        assert bt.results["cagr"] is not None
        assert bt.results["sharpe"] is not None
        return
