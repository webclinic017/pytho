import numpy as np
import pandas as pd
import statsmodels.api as sm
import json

from helpers.portfolio.calculator.calcs.main import (
    max_dd_threshold_position,
)
from helpers.prices import FactorSource


class HistoricalDrawdownEstimatorFactorDataFormatter:
    @staticmethod
    def format(data):
        data["period"] = pd.to_datetime(data.index, unit="s")
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


class HistoricalDrawdownEstimatorResults:
    def get(self):
        temp = {}
        temp["drawdowns"] = {}
        temp["coefs"] = json.loads(self.hde.reg_res.params.to_json())
        if temp["coefs"]["const"]:
            temp["coefs"]["alpha"] = temp["coefs"]["const"]
            del temp["coefs"]["const"]
        temp["se"] = json.loads(self.hde.reg_res.bse.to_json())
        if temp["se"]["const"]:
            temp["se"]["alpha"] = temp["se"]["const"]
            del temp["se"]["const"]

        sim_res = self.hde.hypothetical_dd_dist
        master_data = self.hde.factor_data
        for period in sim_res:
            dd_start = int(period[0])
            dd_end = int(period[1])
            data_slice = master_data.iloc[dd_start:dd_end]
            start_date = str(data_slice.iloc[0].name)
            end_date = str(data_slice.iloc[-1].name)
            joined_date = f"{start_date}-{end_date}"
            temp["drawdowns"][joined_date] = sim_res[period]
        drawdown = {}
        drawdown["drawdown"] = temp
        return drawdown

    def __init__(self, hde):
        self.hde = hde
        return


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
    threshold: `float`
        Drawdown that will trigger recording
    """

    def __init__(self, target_data, factor_data, factors, threshold):
        self.n = 500
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

    def get_results(self):
        return HistoricalDrawdownEstimatorResults(self).get()

    def build_data(self):
        self.merged_data = self.target_data.merge(
            self.factor_data,
            how="left",
            left_index=True,
            right_on="period",
        )
        self.merged_data.dropna(inplace=True)
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
                i / 100,
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
                    if does_match(k, position, 0):
                        has_match = True
                        res[k] = np.append(res[k], dd[2])
                if not has_match:
                    res[position] = np.array([dd[2]])

        boundary = 0
        self.hypothetical_dd_dist = {
            i: (res[i].mean(), res[i].std(), len(res[i]))
            for i in res
            if len(res[i]) > boundary
        }
        return


class HistoricalDrawdownEstimatorFromDataSources(
    HistoricalDrawdownEstimator
):
    """
    Converts a dictionary of datasources into a HistoricalDrawdownEstimator.
    This supports one InvestPySource and N FactorSource objects. Throws
    an error when trying to estimate historical drawdown using non-factor
    sources.

    It is possible to use non-factor sources here but there isn't much
    reason to do since factors have a strong relationship with asset returns
    and other sources may not.

    Parameters
    ----------
    model_prices: `dict[int, DataSource]`
        The assets we are trying to estimate drawdown for.
    threshold: `float`
        Drawdown that will trigger recording

    Throws
    ---------
    ValueError: when called with no FactorSource objects
    """

    def __init__(self, model_prices, threshold):
        flatten = lambda t: [item for sublist in t for item in sublist]
        factor_count = len(
            list(
                filter(
                    lambda x: type(x) == FactorSource,
                    model_prices.values(),
                )
            )
        )
        if factor_count != len(model_prices.values()) - 1:
            raise ValueError(
                "Must call with only InvestPySource and FactorSource objects"
            )

        dep_prices, *ind_prices = model_prices.values()
        factors = flatten([i.get_factors() for i in ind_prices])
        target_data = dep_prices.data
        if len(ind_prices) > 1:
            factor_data = pd.concat(
                list(map(lambda x: x.data, ind_prices))
            )
        else:
            factor_data = ind_prices[0].data
        super().__init__(target_data, factor_data, factors, threshold)
        return
