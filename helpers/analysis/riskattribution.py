import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import json
from arch.bootstrap import IIDBootstrap
from functools import reduce


class Error(Exception):
    pass


class RiskAttributionModel:
    def run_core(self):
        return RiskAttribution(self).get_results()

    def run_rolling(self, window_length):
        return RollingRiskAttribution(self, window_length).get_results()

    def run_bootstrap(self, window_length):
        return BootstrapRiskAttribution(self, window_length).get_results()

    def _set_prices(self, prices):
        self.prices = prices
        return

    def __init__(self, ind_var, dep_var):
        self.ind_var = [int(i) for i in ind_var]
        self.dep_var = int(dep_var)
        return


class RiskAttributionModelResults:
    def numpy_arr(self):
        flatten_dict = lambda x: [
            list(x[i].values()) if isinstance(x[i], dict) else [x[i]]
            for i in x
        ]
        flattened_avgs = sum(flatten_dict(self.avgs), [])
        return np.array(
            [
                self.intercept,
                *np.array(list(self.coef.values())),
                *np.array(list(flattened_avgs)),
            ]
        )

    def as_dict(self):
        return {
            "intercept": self.intercept,
            "coef": self.coef,
            "avgs": self.avgs,
        }

    def json(self):
        return json.dumps(as_dict())

    def __init__(self, intercept, coef, avgs):
        self.intercept = intercept
        self.coef = coef
        self.avgs = avgs
        return


class RiskAttributionBase:
    def get_results(self):
        return self.results.as_dict()

    def get_json_results(self):
        return self.results.json()

    def _date_union(self):
        date_lists = [
            set(self.model.prices[i]["daily_rt"].keys())
            for i in self.model.prices
        ]
        union_of_dates = set.intersection(*date_lists)
        return sorted([int(i) for i in union_of_dates])

    def _find_matching_dates_from_asset_prices(self, price_dict, dates):
        temp = []
        rets = price_dict["daily_rt"]
        for d, v in zip(rets.keys(), rets.values()):
            if int(d) in dates:
                temp.append(v)
        return temp

    def _find_overlapping_dates(self):
        self.union_dates = self._date_union()
        self.overlapping_prices = {
            i: self._find_matching_dates_from_asset_prices(
                self.model.prices[i], self.union_dates
            )
            for i in self.model.prices
        }
        return

    def _format_independent_variables_for_regression(self, ind_data):
        """
        The original format is (number of days, number of assets)
        and we need to transpose to (number of assets, number of
        days) for regression
        """
        return list(map(list, zip(*ind_data)))

    def _run_regression(self, ind, dep):
        reg = LinearRegression().fit(ind, dep)
        intercept = reg.intercept_
        coef = {i: j for i, j in zip(self.model.ind_var, reg.coef_)}

        transpose_ind = np.array(ind).T
        avgs = {
            "dep": sum(dep) / len(dep),
            "ind": {
                i: sum(j) / len(j)
                for i, j in zip(self.model.ind_var, transpose_ind)
            },
        }
        return intercept, coef, avgs

    def _build_data(self):
        raise NotImplementedError()

    def __init__(self, risk_model):
        self.model = risk_model
        return


class RiskAttribution(RiskAttributionBase):
    def get_results(self):
        return {
            "core": self.results.as_dict(),
            "min_date": min(self.union_dates),
            "max_date": max(self.union_dates),
        }

    def _build_data(self):
        self._find_overlapping_dates()

        dep_data = self.overlapping_prices[self.model.dep_var]
        ind_data = self._format_independent_variables_for_regression(
            [self.overlapping_prices[i] for i in self.model.ind_var]
        )
        self.results = RiskAttributionModelResults(
            *self._run_regression(ind_data, dep_data)
        )
        return

    def __init__(self, model):
        super().__init__(model)
        self._build_data()
        return


class WindowLengthError(Exception):
    def __init__(self):
        self.message = "Window length longer than the data"
        return


class RollingRiskAttribution(RiskAttributionBase):
    def get_results(self):
        dates = self.union_dates[
            self._window_length : -self._window_length
        ]
        return {
            "rolling": [i.as_dict() for i in self.results],
            "min_date": min(self.union_dates),
            "max_date": max(self.union_dates),
            "dates": dates,
        }

    def get_json_results(self):
        return json.dumps([i.json() for i in self.results])

    def _build_data(self):
        self._find_overlapping_dates()

        dep_data = self.overlapping_prices[self.model.dep_var]
        ind_data = [self.overlapping_prices[i] for i in self.model.ind_var]
        if len(dep_data) < self._window_length:
            raise WindowLengthError()

        self.results = []
        for i in range(
            self._window_length, len(dep_data) - self._window_length
        ):
            dep_data_chunk = dep_data[i - self._window_length : i]
            ind_data_chunk = (
                self._format_independent_variables_for_regression(
                    j[i : i + self._window_length] for j in ind_data
                )
            )
            self.results.append(
                RiskAttributionModelResults(
                    *self._run_regression(ind_data_chunk, dep_data_chunk)
                )
            )
        return

    def __init__(self, model, window_length):
        super().__init__(model)
        self._window_length = window_length
        self._build_data()
        return


class BootstrapRiskAttribution(RollingRiskAttribution):
    def get_results(self):
        res = {}
        res["min_date"] = min(self.union_dates)
        res["max_date"] = max(self.union_dates)
        res["bootstrap"] = {}
        res["bootstrap"]["ind"] = list(self.bootstrap[0])
        res["bootstrap"]["dep"] = {}
        for i, j in enumerate(self.model.ind_var):
            res["bootstrap"]["dep"][j] = list(self.bootstrap[i + 1])
        return res

    def get_json_results(self):
        return json.dumps(self.get_results())

    def _build_bootstrap(self):
        def _bootstrap_func(x):
            return np.array([i.numpy_arr() for i in x]).mean(axis=0)

        bs = IIDBootstrap(np.array(self.results))
        bs_results = bs.conf_int(_bootstrap_func, method="bc").T
        ind_variable_cnt = len(self.model.ind_var)
        self.bootstrap = np.array(
            [bs_results[0], *bs_results[1 : 1 + ind_variable_cnt]]
        )
        return

    def __init__(self, model, window_length):
        super().__init__(model, window_length)
        self._build_bootstrap()
        return
