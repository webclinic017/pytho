from django.test import TestCase
import pandas as pd
import datetime

from helpers.prices.data import FactorSource, InvestPySource
from ..drawdown import (
    HistoricalDrawdownEstimatorFromDataSources,
)

from helpers import prices
from api.models import Coverage, FactorReturns
import numpy as np


class TestHistoricalDrawdownEstimator(TestCase):
    def setUp(self):
        c1 = Coverage.objects.create(
            id=1,
            currency="GBP",
            country_name="united_kingdom",
            name="Random Name",
            issuer="Random Issuer",
            security_type="fund",
        )
        c1.save()

        self.fake_data = {}
        asset_dates = [
            pd.Timestamp((datetime.date(2000, 9, 30) + datetime.timedelta(days=i)))
            for i in range(1000)
        ]
        idx = pd.Index(data=asset_dates, name="Date")
        df = pd.DataFrame(
            {
                "Close": np.random.normal(100, 5, 1000),
                "Open": np.random.normal(100, 5, 1000),
            },
            index=idx,
        )
        self.fake_data[1] = InvestPySource(df)

        factor_dates = [
            pd.Timestamp(
                (datetime.date(2001, 9, 30) + datetime.timedelta(days=i))
            ).timestamp()
            for i in range(200)
        ]

        for i, j, k in zip(range(200), np.random.normal(0, 0.1, 200), factor_dates):
            f1 = FactorReturns.objects.create(
                factor="Mkt",
                ret=j,
                name="fake_factor",
                period=k,
                period_name=str(i) + "fake_factor",
            )
            f1.save()
        return

    def test_that_we_can_build_hypothetical_dd_estimate_from_sources(self):
        factor_obj_result = FactorReturns.objects.filter(name="fake_factor")
        df1 = pd.DataFrame([i.__dict__ for i in factor_obj_result])
        self.fake_data[2] = FactorSource(df1)

        hde = HistoricalDrawdownEstimatorFromDataSources(self.fake_data, -0.01)
        self.assertTrue(hde.drawdowns)
        self.assertTrue(hde.get_results())
        return
