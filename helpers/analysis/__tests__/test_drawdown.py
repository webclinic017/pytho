from django.test import TestCase
import pandas as pd
from ..drawdown import HistoricalDrawdownEstimator

from helpers import prices 
from api.models import Coverage, FactorReturns
import numpy as np

class TestHistoricalDrawdownEstimator(TestCase): 
    def setUp(self):
        c1 = Coverage.objects.create(
            id=14678,
            currency="GBP",
            country_name="united kingdom",
            name="Fundsmith Equity I Acc",
            issuer="Fundsmith LLP",
            security_type="fund",
        )
        c1.save()

        for i, j in zip(range(1000), np.random.normal(0, 0.2, 1000)):
            f1 = FactorReturns.objects.create(
                    factor='Mkt',
                    ret=j,
                    name="fake_factor",
                    period=i,
                    period_name=str(i)+"fake_factor"
            )
            f1.save()

        self.fake_prices = {"daily_rt": {i:j for i, j in zip(range(500,700), np.random.normal(0, 0.2, 200))}}
        return

    def test_run(self):
        coverage = [14678]
        coverage_obj_result = Coverage.objects.filter(id__in=coverage)

        df = pd.DataFrame(self.fake_prices)
        factor_obj_result = FactorReturns.objects.filter(
                name="fake_factor")
        df1 = pd.DataFrame([i.__dict__ for i in factor_obj_result])
        HistoricalDrawdownEstimator(df, df1, ['Mkt'])
        self.assertFalse(True)
 
