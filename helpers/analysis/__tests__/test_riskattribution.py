from django.test import SimpleTestCase
from django.conf import settings
import json
import os
import pandas as pd

from helpers.prices import InvestPySource

from ..riskattribution import (
    RiskAttribution,
    RiskAttributionBase,
    RollingRiskAttribution,
    BootstrapRiskAttribution,
    WindowLengthError,
)


def get_data():
    mocks_dir = os.path.dirname(os.path.realpath(__file__)) + "/__mocks__/"
    contents = os.listdir(mocks_dir)
    res = {}
    for i, j in enumerate(contents):
        with open(mocks_dir + j, "r") as f:
            df = pd.read_json(f.read())
            df.index.rename("Date", inplace=True)
            res[i] = InvestPySource(df)
    return res


class TestBootstrapRiskAttribution(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return

    def test_that_bootstrap_loads(self):
        ra = BootstrapRiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
            window_length=5,
        )
        res = ra.run()
        return


class TestRollingRiskAttribution(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return

    def test_that_rolling_risk_attribution_loads(self):
        ra = RollingRiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
            window_length=5,
        )
        res = ra.run()
        return

    def test_that_error_is_thrown_with_window_longer_than_data(self):
        with self.assertRaises(WindowLengthError) as context:
            ra = RollingRiskAttribution(
                dep=0,
                ind=[1],
                data=self.data,
                window_length=99999999,
            )
            res = ra.run()
        return

    def test_that_dates_is_same_length_as_data(self)    :
        ra = RollingRiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
            window_length=5,
        )
        res = ra.run().get_results()
        self.assertTrue(len(res['dates']) == len(res['rolling'][0]))
        return


class TestRiskAttribution(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return

    def test_that_prices_with_string_keys_throws_no_error(self):
        ra = RiskAttribution(
            dep="0",
            ind=["1"],
            data=self.data,
        )
        res = ra.run()
        return

    def test_that_risk_attribution_loads(self):
        ra = RiskAttribution(
            dep="0",
            ind=["1"],
            data=self.data,
        )
        res = ra.run().get_results()
        self.assertTrue(res["core"]["coef"])
        self.assertTrue(len(res["core"]["coef"].keys()) == 1)
        self.assertTrue(res["core"]["intercept"])
        self.assertTrue(res["core"]["avgs"])
        return

class TestRiskAttributionBase(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return
    
    def test_that_get_windows_produces_valid_number_of_windows(self):
        ra = RiskAttribution(
            dep="0",
            ind=["1"],
            data=self.data,
        )
        count=0
        window_length=5
        windows = ra.get_windows(window_length)
        for ind, dep in windows:
            count+=1
        expected_length = len(ra.ind)-5
        self.assertTrue(count==expected_length)
        return