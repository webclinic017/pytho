from django.test import TestCase, Client
import json
from unittest.mock import patch
import pandas as pd
import numpy as np
import datetime

from .models import Coverage, RealReturns
from helpers.prices import InvestPySource


class TestPortfolioSimulator(TestCase):
    def setUp(self):
        self.c = Client()
        for i in range(100):
            instance = RealReturns.objects.create(
                id=100 + i,
                country="United States",
                year=1900 + i,
                eq_tr=0.09,
                bond_tr=0.09,
                bill_rate=0.09,
                inf=0.09,
                currency=0.09,
                eq_tr_local=0.09,
                bond_tr_local=0.08,
                eq_tr_usd=0.09,
                bond_tr_usd=0.09,
            )
            instance.save()
        for i in range(100):
            instance = RealReturns.objects.create(
                id=200 + i,
                country="United Kingdom",
                year=1900 + i,
                eq_tr=0.09,
                bond_tr=0.09,
                bill_rate=0.09,
                inf=0.09,
                currency=0.09,
                eq_tr_local=0.07,
                bond_tr_local=0.06,
                eq_tr_usd=0.09,
                bond_tr_usd=0.09,
            )
            instance.save()
        for i in range(100):
            instance = RealReturns.objects.create(
                id=300 + i,
                country="France",
                year=1900 + i,
                eq_tr=0.09,
                bond_tr=0.09,
                bill_rate=0.09,
                inf=0.09,
                currency=0.09,
                eq_tr_local=0.05,
                bond_tr_local=0.04,
                eq_tr_usd=0.09,
                bond_tr_usd=0.09,
            )
            instance.save()
        for i in range(100):
            instance = RealReturns.objects.create(
                id=400 + i,
                country="Germany",
                year=1900 + i,
                eq_tr=0.09,
                bond_tr=0.09,
                bill_rate=0.09,
                inf=0.09,
                currency=0.09,
                eq_tr_local=0.03,
                bond_tr_local=0.02,
                eq_tr_usd=0.09,
                bond_tr_usd=0.09,
            )
            instance.save()
        return

    def test_that_simulation_is_idempotent_with_countries_provided(self):

        weights = []
        weights.append([0.9, 0.1, 0.0, 0.0])
        weights.append([0.9, 0.1, 0.0, 0.0])
        sim_data = [
            ["France", "United Kingdom", "United Kingdom", "Germany"],
            [1919, 1935, 1916, 1943],
            [1958, 1974, 1955, 1982],
        ]

        req = {
            "weights": weights,
            "sim_data": sim_data,
            "sim_position": 2,
        }

        response = self.c.post(
            "/api/portfoliosim", req, content_type="application/json"
        )
        response_cagr = response.json()["simportfolio"]["cagr"]

        response1 = self.c.post(
            "/api/portfoliosim", req, content_type="application/json"
        )
        response1_cagr = response.json()["simportfolio"]["cagr"]

        self.assertTrue(response_cagr == response1_cagr)
        return

    def test_main_simulation_flow(self):
        weights = []
        sim_data = None

        for i in range(30):
            weights.append([0.9, 0.1, 0.0, 0.0])

            if sim_data:
                req = {
                    "weights": weights,
                    "sim_data": sim_data,
                    "sim_position": i + 1,
                }
            else:
                req = {
                    "weights": weights,
                    "sim_position": i + 1,
                }

            response = self.c.post(
                "/api/portfoliosim", req, content_type="application/json"
            )
            if not sim_data:
                sim_data = response.json()["sim_data"]
        return


class TestBootstrapRiskAttributionPortfolio(TestCase):
    def setUp(self):
        self.c = Client()
        instance = Coverage.objects.create(
            id=666,
            country_name="united_states",
            name="S&P 500",
            security_type="index",
        )
        instance.save()
        instance = Coverage.objects.create(
            id=667,
            country_name="united_kingdom",
            name="FTSE 100",
            security_type="index",
        )
        instance.save()

        self.fake_data = {}
        asset_ids = [666, 667]
        means = [1, 2]
        stdevs = [0.01, 0.02]

        dates = [
            pd.Timestamp((datetime.date(2000, 9, 30) + datetime.timedelta(days=i)))
            for i in range(100)
        ]
        for asset_id, mean, stdev in zip(asset_ids, means, stdevs):
            idx = pd.Index(data=dates, name="Date")
            df = pd.DataFrame(
                {
                    "Close": np.random.normal(mean, stdev, 100),
                    "Open": np.random.normal(mean, stdev, 100),
                },
                index=idx,
            )
            self.fake_data[asset_id] = InvestPySource(df)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_risk_attribution_runs(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        response = self.c.get(
            "/api/bootstrapriskattribution?ind=666&dep=667&window=5",
            content_type="application/json",
        )
        self.assertTrue(response.status_code == 200)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_risk_attribution_throws_error_with_no_input(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        response = self.c.get(
            "/api/bootstrapriskattribution", content_type="application/json"
        )
        self.assertTrue(response.status_code == 400)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_risk_attribution_throws_error_with_bad_input(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        response = self.c.get(
            "/api/bootstrapriskattribution?ind=666", content_type="application/json"
        )
        self.assertTrue(response.status_code == 400)

        response = self.c.get(
            "/api/bootstrapriskattribution?dep=666", content_type="application/json"
        )
        self.assertTrue(response.status_code == 400)

        response = self.c.get(
            "/api/bootstrapriskattribution?dep=Test&ind=Test",
            content_type="application/json",
        )
        self.assertTrue(response.status_code == 400)
        response = self.c.get(
            "/api/bootstrapriskattribution?dep=666&ind=667&window=Test",
            content_type="application/json",
        )
        self.assertTrue(response.status_code == 400)
        return

    def test_that_risk_attribution_catches_error_with_data_fetch(self):
        self.assertTrue(False)
        return

    def test_that_risk_attribution_catches_error_with_bad_risk_attribution(self):
        self.assertTrue(False)
        return


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
        with open("./api/__mock__/spy.json", "r") as f:
            df = pd.read_json(f.read())
            df.index.rename("Date", inplace=True)
            self.fake_data = {666: InvestPySource(df)}
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_backtest_runs(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        req = {"data": {"assets": [666], "weights": [1]}}
        response = self.c.post("/api/backtest", req, content_type="application/json")
        json_resp = json.loads(response.content.decode("utf-8"))
        self.assertTrue("data" in json_resp)

        data_resp = json_resp["data"]
        self.assertTrue("returns" in data_resp)
        self.assertTrue("cagr" in data_resp)
        self.assertTrue("vol" in data_resp)
        self.assertTrue("maxdd" in data_resp)
        self.assertTrue("cumReturns" in data_resp)
        self.assertTrue("equityCurve" in data_resp)
        self.assertTrue("returnsQuantiles" in data_resp)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_backtest_throws_error_with_no_input(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        req = {}
        req1 = {"data": {"assets": [], "weights": []}}

        response = self.c.post("/api/backtest", req, content_type="application/json")
        response1 = self.c.post("/api/backtest", req1, content_type="application/json")
        self.assertTrue(response.status_code == 400)
        self.assertTrue(response1.status_code == 404)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_backtest_throws_error_with_bad_input(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = self.fake_data

        req = {"data": {"assets": [666], "weights": []}}
        req1 = {"data": {"assets": [], "weights": [1]}}
        req2 = {"data": {"assets": ["bad"], "weights": [1]}}

        response = self.c.post("/api/backtest", req, content_type="application/json")
        response1 = self.c.post("/api/backtest", req1, content_type="application/json")
        response2 = self.c.post("/api/backtest", req2, content_type="application/json")
        self.assertTrue(response.status_code == 404)
        self.assertTrue(response1.status_code == 404)
        self.assertTrue(response2.status_code == 404)
        return

    @patch("api.views.prices.PriceAPIRequests")
    def test_that_backtest_throws_error_with_failed_data_fetch(self, mock_obj):
        instance = mock_obj.return_value
        instance.get.return_value = []

        req = {"data": {"assets": [666], "weights": [1]}}

        response = self.c.post("/api/backtest", req, content_type="application/json")
        self.assertTrue(response.status_code == 404)
        return
