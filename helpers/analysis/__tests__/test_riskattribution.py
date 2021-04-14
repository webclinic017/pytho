from django.test import SimpleTestCase
from django.conf import settings
import json
import os

from ..riskattribution import RiskAttributionModel, WindowLengthError

class TestBootstrapRiskAttribution(SimpleTestCase):
    def setUp(self):
        path_from_base = "/testdata"
        curr_dir = os.path.dirname(os.path.realpath(__file__))
        with open(curr_dir + path_from_base, "r") as f:
            data_json = json.loads(f.read())
            self.data = {int(i): data_json[i] for i in data_json}
        return

    def test_that_bootstrap_loads(self):
        ra = RiskAttributionModel(
            dep_var=14678,
            ind_var=[666, 664],
        )
        ra._set_prices(self.data)
        res = ra.run_bootstrap(30)
        return


class TestRollingRiskAttribution(SimpleTestCase):
    def setUp(self):
        path_from_base = "/testdata"
        curr_dir = os.path.dirname(os.path.realpath(__file__))
        with open(curr_dir + path_from_base, "r") as f:
            data_json = json.loads(f.read())
            self.data = {int(i): data_json[i] for i in data_json}
        return

    def test_that_rolling_risk_attribution_loads(self):
        ra = RiskAttributionModel(
            dep_var=14678,
            ind_var=[666, 664],
        )
        ra._set_prices(self.data)
        res = ra.run_rolling(30)
        return

    def test_that_error_is_thrown_with_window_longer_than_data(self):
        with self.assertRaises(WindowLengthError) as context:
            ra = RiskAttributionModel(
                dep_var=14678,
                ind_var=[666, 664],
            )
            ra._set_prices(self.data)
            ra.run_rolling(999999)
        return


class TestRiskAttribution(SimpleTestCase):
    def setUp(self):
        path_from_base = "/testdata"
        curr_dir = os.path.dirname(os.path.realpath(__file__))
        with open(curr_dir + path_from_base, "r") as f:
            data_json = json.loads(f.read())
            self.data = {int(i): data_json[i] for i in data_json}
        return

    def test_that_prices_with_string_keys_throws_no_error(self):
        ra = RiskAttributionModel(
            dep_var="14678",
            ind_var=["666", "664"],
        )
        ra._set_prices(self.data)
        res = ra.run_core()
        return

    def test_that_risk_attribution_loads(self):
        ra = RiskAttributionModel(
            dep_var=14678,
            ind_var=[666, 664],
        )
        ra._set_prices(self.data)
        res = ra.run_core()
        self.assertTrue(res["core"]["coef"])
        self.assertTrue(len(res["core"]["coef"].keys()) == 2)
        self.assertTrue(res["core"]["intercept"])
        self.assertTrue(res["core"]["avgs"])
        return
