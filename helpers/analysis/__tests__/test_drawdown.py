from django.test import TestCase

from helpers.prices.data import FakeData
from ..drawdown import (
    HistoricalDrawdownEstimatorFromDataSources,
    HistoricalDrawdownEstimatorNoFactorSourceException,
)


class TestHistoricalDrawdownEstimator(TestCase):
    def setUp(self):
        d1 = FakeData.get_investpy(100, 20, 1000, 4004)
        d1.convert_to_monthly()
        self.fake_data = {}
        self.fake_data[1] = d1
        self.fake_data[2] = FakeData.get_factor(0, 0.2, 200)
        return

    def test_that_throws_error_when_no_factor_source_objects_passed(self):
        self.assertRaises(
            HistoricalDrawdownEstimatorNoFactorSourceException,
            HistoricalDrawdownEstimatorFromDataSources,
            1,
            [1],
            self.fake_data,
            -0.01,
        )

    def test_that_throws_error_when_factor_source_passed_as_dependent(self):
        self.assertRaises(
            HistoricalDrawdownEstimatorNoFactorSourceException,
            HistoricalDrawdownEstimatorFromDataSources,
            2,
            [1],
            self.fake_data,
            -0.01,
        )

    def test_that_throws_error_when_independent_and_dependent_are_factor_source(self):
        self.assertRaises(
            HistoricalDrawdownEstimatorNoFactorSourceException,
            HistoricalDrawdownEstimatorFromDataSources,
            2,
            [2],
            self.fake_data,
            -0.01,
        )

    def test_that_we_can_build_hypothetical_dd_estimate_from_sources(self):
        hde = HistoricalDrawdownEstimatorFromDataSources(
            ind=[2], dep=1, model_prices=self.fake_data, threshold=-0.01
        )
        self.assertTrue(hde.drawdowns)
        self.assertTrue(hde.get_results())
        return
