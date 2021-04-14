import numpy as np
import pandas as pd
import statsmodels.api as sm

class HistoricalDrawdownEstimatorFactorDataFormatter:
    @staticmethod
    def format(data):
        data['period'] = pd.to_datetime(data['period'], unit='s')
        pivoted = data.pivot(
                index='period', columns='factor', values='ret')
        return pivoted

class HistoricalDrawdownEstimatorTargetDataFormatter:
    @staticmethod
    def format(data):
        data.index = pd.to_datetime(data.index, unit='s')
        return data

class DrawdownCalculator:
    @staticmethod
    def calc(data):
        return data

class HistoricalDrawdownEstimator:
    """
    Uses factor loadings to simulate hypothetical past performance
    of assets.

    Parameters
    ----------
    target_data : `pd.DataFrame`
        The asset whose performance we are trying to simulate
    factor_data : `pd.DataFrame`
        The factors used to simulate past performance
    factors : `list[str]`
        List of factors in factor_data
    """
    def __init__(self, target_data, factor_data, factors):
        self.n = 5
        self.target_data = HistoricalDrawdownEstimatorTargetDataFormatter.format(
                target_data)
        self.factor_data = HistoricalDrawdownEstimatorFactorDataFormatter.format(
                factor_data)
        self.factors = factors

        self.build_data()
        self.build_regression()
        self.build_sample_coefs()
        self.estimator_algo()
        return

    def build_data(self):
        self.merged_data = self.target_data.merge(
                self.factor_data,
                how='left',
                left_index=True,
                right_on='period')
        self.factor_rets = self.factor_data[self.factors].values
        return

    def build_regression(self):
        X = sm.add_constant(
                self.merged_data[self.factors])
        y = self.merged_data[['daily_rt']]
        self.reg_mod = sm.OLS(y, X)
        self.reg_res = self.reg_mod.fit()
        return

    def build_sample_coefs(self):
        temp = []
        for i, j in zip(self.reg_res.params, self.reg_res.bse):
            temp.append(
                    np.random.normal(i, j, self.n))
        self.sample_coefs = np.array(temp)
        return

    def estimator_algo(self): 
        temp = []
        for i in self.sample_coefs.T:
            sample_factor_weights = i[1:]
            sample_factor_rets = np.sum(
                    sample_factor_weights * self.factor_rets,
                    axis=1)
            temp.append(sample_factor_rets)
        return

