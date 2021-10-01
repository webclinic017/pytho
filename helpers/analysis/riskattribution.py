import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import json
from arch.bootstrap import IIDBootstrap
from functools import reduce

from .results import (
    RegressionResults,
    RiskAttributionResults,
    RollingRiskAttributionResults,
    BootstrapRiskAttributionResults,
)


class WindowLengthError(Exception):
    def __init__(self):
        self.message = "Window length longer than the data"
        return


class RiskAttributionBase:
    def get_dates_union(self):
        date_lists = [
            set(i.get_dates()) for i in self.definition.get_all(self.data)
        ]
        union_of_dates = set.intersection(*date_lists)
        return sorted([int(i) for i in union_of_dates])

    def get_windows(self, window_length):
        formatter = lambda d: list(map(list, zip(*d)))

        dep_length = self.definition.get_dep_data(self.data).length
        if dep_length < window_length:
            raise WindowLengthError()

        windows = range(
            window_length, len(self.dates)
        )
        for w in windows:
            window_dates = self.dates[w - window_length : w]

            dep = (
                self.definition.get_dep_data(self.data)
                .find_dates(window_dates)
                .get_returns()
                .tolist()
            )
            ind = formatter(
                [
                    i.find_dates(window_dates).get_returns().tolist()
                    for i in self.definition.get_ind_data(self.data)
                ]
            )
            yield dep, ind

    def get_data(self):
        """
        The original format is (number of days, number of assets)
        and we need to transpose to (number of assets, number of
        days) for regression
        """
        ##This function should either run on a slice of the data
        ##which can be passed into the function
        ##or should default to just fetching all the data at once
        formatter = lambda d: list(map(list, zip(*d)))

        dep = (
            self.definition.get_dep_data(self.data)
            .find_dates(self.dates)
            .get_returns()
            .tolist()
        )
        ind = formatter(
            [
                i.find_dates(self.dates).get_returns().tolist()
                for i in self.definition.get_ind_data(self.data)
            ]
        )
        return dep, ind

    def _run_regression(self, ind, dep):
        reg = LinearRegression().fit(ind, dep)
        intercept = reg.intercept_
        coef = {i: j for i, j in zip(self.definition.ind, reg.coef_)}

        transpose_ind = np.array(ind).T
        avgs = {
            "dep": sum(dep) / len(dep),
            "ind": {
                i: sum(j) / len(j)
                for i, j in zip(self.definition.ind, transpose_ind)
            },
        }
        return RegressionResults(intercept, coef, avgs)

    def _build_data(self):
        raise NotImplementedError()

    def run(self):
        raise NotImplementedError()

    def __init__(self, definition, data):
        """RiskAttributionBase that defines common functions for
        any RiskAttribution model.

        Parameters
        ----------
        defintion: `RiskAttributionDefinition`
          Defines dependent and independent variables
        data: `Dict{int:DataSource}`
          Integer-indexed dictionary of objects conforming to the DataSource
          interface.
        """
        self.definition = definition
        self.data = data
        self.dates = self.get_dates_union()
        return


class RiskAttributionDefinition:
    def get_all(self, data):
        return [*self.get_ind_data(data), self.get_dep_data(data)]

    def get_ind_data(self, data):
        return [data.get(i) for i in self.ind]

    def get_dep_data(self, data):
        return data.get(self.dep)

    def __init__(self, ind, dep):
        self.ind = [int(i) for i in ind]
        self.dep = int(dep)
        return


class RiskAttribution(RiskAttributionBase):
    def _build_data(self):
        self.dep, self.ind = self.get_data()
        return

    def run(self):
        self.results = self._run_regression(self.ind, self.dep)
        return RiskAttributionResults(self)

    def __init__(self, ind, dep, data):
        """RiskAttribution model that uses all the data for the assets
        to estimate the composition of the dependent asset's risk.

        Parameters
        ----------
        ind: `List[int]`
          List of ints representing the Coverage id of the independent
          assets in model
        dep: `int`
          Int representing the Coverage id of the dependent asset in
          model
        data: `Dict{int:DataSource}`
          Integer-indexed dictionary of objects conforming to the DataSource
          interface.
        """
        definition = RiskAttributionDefinition(ind, dep)
        super().__init__(definition, data)
        self._build_data()
        return


class RollingRiskAttribution(RiskAttributionBase):
    def run(self):
        self.results = []
        for dep, ind in self.get_windows(self._window_length):
            self.results.append(self._run_regression(ind, dep))
        #Rolling window won't have the first N dates
        self.dates = self.dates[self._window_length:]
        return RollingRiskAttributionResults(self)

    def __init__(self, ind, dep, data, window_length):
        """RiskAttribution model that calculated the composition
        of the dependent asset's risk over rolling periods of N
        length.

        Parameters
        ----------
        ind: `List[int]`
          List of ints representing the Coverage id of the independent
          assets in model
        dep: `int`
          Int representing the Coverage id of the dependent asset in
          model
        data: `Dict{int:DataSource}`
          Integer-indexed dictionary of objects conforming to the DataSource
          interface.
        window_length: `int`
          Length of the rolling windows
        """
        definition = RiskAttributionDefinition(ind, dep)
        super().__init__(definition, data)
        self._window_length = window_length
        return


class BootstrapRiskAttribution(RiskAttributionBase):
    def _build_bootstrap(self):
        def _bootstrap_func(x):
            return np.array([i.numpy_arr() for i in x]).mean(axis=0)

        bs = IIDBootstrap(np.array(self.results))
        bs_results = bs.conf_int(_bootstrap_func, method="bc").T
        ind_variable_cnt = len(self.definition.ind)
        self.bootstrap = np.array(
            [bs_results[0], *bs_results[1 : 1 + ind_variable_cnt]]
        )
        return

    def run(self):
        rra = RollingRiskAttribution(
            ind=self.ind,
            dep=self.dep,
            data=self.data,
            window_length=self.window_length,
        )
        self.results = rra.run()
        self._build_bootstrap()
        return BootstrapRiskAttributionResults(self)

    def __init__(self, ind, dep, data, window_length):
        """RiskAttribution model that constructs a bootstrap estimates
        of the dependent asset's risk using the result of the
        RollingRiskAttribution run

        Parameters
        ----------
        ind: `List[int]`
          List of ints representing the Coverage id of the independent
          assets in model
        dep: `int`
          Int representing the Coverage id of the dependent asset in
          model
        data: `Dict{int:DataSource}`
          Integer-indexed dictionary of objects conforming to the DataSource
          interface.
        window_length: `int`
          Length of the rolling windows
        """
        definition = RiskAttributionDefinition(ind, dep)
        super().__init__(definition, data)
        self.window_length = window_length
        self.ind = ind
        self.dep = dep
        return
