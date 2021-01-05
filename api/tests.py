from django.test import TestCase, Client
import json
from unittest.mock import patch

from .models import Coverage


class TestBacktestPortfolio(TestCase):
    def setUp(self):
        self.c = Client()
        instance = Coverage.objects.create(
            id=666,
            country_name="united_states",
            name="S&P 500",
            security_type="index",
        )
        instance.save()
        with open("./api/__mock__/daily_returns.json", "r") as f:
            self.fake_data = {666: json.loads(f.read())}
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_backtest_runs(self, mock_obj):
        instance = mock_obj.return_value
        instance.get_price_history.return_value = self.fake_data

        req = {"data": {"assets": [666], "weights": [1]}}
        response = self.c.post(
            "/api/backtest", req, content_type="application/json"
        )
        json_resp = json.loads(response.content.decode("utf-8"))
        self.assertTrue("data" in json_resp)

        data_resp = json_resp["data"]
        self.assertTrue("cagr" in data_resp)
        self.assertTrue("vol" in data_resp)
        self.assertTrue("maxdd" in data_resp)
        return
