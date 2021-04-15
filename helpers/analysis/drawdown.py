import numpy as np
import pandas as pd
import statsmodels.api as sm

from helpers.portfolio.calculator.calcs.main import (
    max_dd_threshold_position,
)


class HistoricalDrawdownEstimatorFactorDataFormatter:
    @staticmethod
    def format(data):
        data["period"] = pd.to_datetime(data["period"], unit="s")
        pivoted = data.pivot(
            index="period", columns="factor", values="ret"
        )
        return pivoted


class HistoricalDrawdownEstimatorTargetDataFormatter:
    @staticmethod
    def format(data):
        data.index = pd.to_datetime(data.index, unit="s")
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

    def __init__(self, target_data, factor_data, factors, threshold):
        self.n = 100
        self.target_data = (
            HistoricalDrawdownEstimatorTargetDataFormatter.format(
                target_data
            )
        )
        self.factor_data = (
            HistoricalDrawdownEstimatorFactorDataFormatter.format(
                factor_data
            )
        )
        self.factors = factors
        self.threshold = threshold

        self.build_data()
        self.build_regression()
        self.build_sample_coefs()
        self.estimator_algo()
        self.calc_drawdowns()
        self.group_drawdowns()
        return

    def build_data(self):
        self.merged_data = self.target_data.merge(
            self.factor_data,
            how="left",
            left_index=True,
            right_on="period",
        )
        self.factor_rets = self.factor_data[self.factors].values
        return

    def build_regression(self):
        X = sm.add_constant(self.merged_data[self.factors])
        y = self.merged_data[["daily_rt"]]
        self.reg_mod = sm.OLS(y, X)
        self.reg_res = self.reg_mod.fit()
        return

    def build_sample_coefs(self):
        temp = []
        for i, j in zip(self.reg_res.params, self.reg_res.bse):
            temp.append(np.random.normal(i, j, self.n))
        self.sample_coefs = np.array(temp)
        return

    def estimator_algo(self):
        temp = []
        for i in self.sample_coefs.T:
            sample_factor_weights = i[1:]
            sample_factor_rets = np.sum(
                sample_factor_weights * self.factor_rets, axis=1
            )
            temp.append(sample_factor_rets)
        self.hypothetical_rets = temp
        return

    def calc_drawdowns(self):
        self.hypothetical_dd = []
        for i in self.hypothetical_rets:
            dd = max_dd_threshold_position(
                i,
                3,
                self.threshold,
            )
            if dd:
                self.hypothetical_dd.append(dd)
            else:
                self.hypothetical_dd.append([])
        return

    def group_drawdowns(self):
        does_match = (
            lambda dd, match, pos: match[pos] > dd[pos] - 5
            and match[pos] < dd[pos] + 5
        )
        res = {}
        for dd_group in self.hypothetical_dd:
            for dd in dd_group:
                has_match = False
                if not dd:
                    continue
                position = (dd[0], dd[1])
                for k in res:
                    if does_match(k, position, 0) and does_match(
                        k, position, 0
                    ):
                        has_match = True
                        res[k] = np.append(res[k], dd[2])
                if not has_match:
                    res[position] = np.array(dd[2])
        self.hypothetical_dd_dist = {
            i: (res[i].mean(), res[i].std()) for i in res
        }
        return
