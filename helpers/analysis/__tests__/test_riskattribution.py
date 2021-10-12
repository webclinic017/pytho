from django.test import SimpleTestCase
from django.conf import settings
import json
import os
import pandas as pd

from helpers.prices import InvestPySource

from ..riskattribution import (
    RiskAttribution,
    RollingRiskAttribution,
    BootstrapRiskAttribution,
    WindowLengthError,
    RiskAttributionUnusableInputException,
    RiskAttributionInvalidInputException,
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

    def test_that_dates_is_same_length_as_data_and_valid(self):
        last = self.data[0].get_dates()[-1]
        ra = RollingRiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
            window_length=5,
        )
        res = ra.run()
        self.assertTrue(len(res["dates"]) == len(res["regressions"]))
        self.assertTrue(last in res["dates"])
        return


class TestRiskAttribution(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return

    def test_that_prices_with_string_keys_throws_error(self):
        self.assertRaises(
            RiskAttributionInvalidInputException, RiskAttribution, ["1"], "0", self.data
        )
        return

    def test_that_risk_attribution_loads(self):
        ra = RiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
        )
        res = ra.run()
        regression = res['regression']
        self.assertTrue(regression)
        self.assertTrue(len(regression['coefficients']) == 1)
        self.assertTrue(regression['intercept'])
        self.assertTrue(res['avgs'])
        return


class TestRiskAttributionBase(SimpleTestCase):
    def setUp(self):
        self.data = get_data()
        return

    def test_that_throws_error_when_dates_dont_overlap(self):
        idx = pd.Index(
            data=[pd.Timestamp(2000, 1, 1), pd.Timestamp(2000, 1, 2)], name="Date"
        )
        idx1 = pd.Index(
            data=[pd.Timestamp(2001, 1, 1), pd.Timestamp(2001, 1, 2)], name="Date"
        )

        df = pd.DataFrame({"Close": [1, 2], "Open": [1, 2]}, index=idx)
        df1 = pd.DataFrame({"Close": [1, 2], "Open": [1, 2]}, index=idx1)
        data = {0: InvestPySource(df), 1: InvestPySource(df1)}
        self.assertRaises(
            RiskAttributionUnusableInputException, RiskAttribution, [1], 0, data
        )
        return

    def test_that_error_thrown_with_invalid_inputs(self):
        self.assertRaises(
            RiskAttributionInvalidInputException, RiskAttribution, 10, 0, self.data
        )
        self.assertRaises(
            RiskAttributionUnusableInputException,
            RiskAttribution,
            [10],
            0,
            self.data,
        )

    def test_that_get_windows_produces_valid_number_of_windows(self):
        ra = RiskAttribution(
            dep=0,
            ind=[1],
            data=self.data,
        )
        count = 0
        window_length = 5
        windows = ra.get_windows(window_length)
        for ind, dep in windows:
            count += 1
        expected_length = len(ra.ind_data) - 5
        self.assertTrue(count == expected_length)
        return
