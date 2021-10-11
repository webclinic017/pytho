import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from typing import List, Dict, Optional, TypedDict
from arch.bootstrap import IIDBootstrap

from helpers.prices.data import DataSource
from .results import BootstrapRiskAttributionResults


class WindowLengthError(Exception):
    def __init__(self):
        super().__init__()
        self.message = "Window length longer than the data"


class RiskAttributionInvalidInputException(Exception):
    def __init__(self, message):
        super().__init__()
        self.message = message


class RiskAttributionUnusableInputException(Exception):
    def __init__(self, message):
        super().__init__()
        self.message = message


class RegressionCoefficient(TypedDict):
    name: str
    coef: float
    error: float


class RegressionResult(TypedDict):
    intercept: float
    coefficients: List[RegressionCoefficient]


class Average(TypedDict):
    name: str
    avg: float


class RiskAttributionResult(TypedDict):
    regression: RegressionResult
    avgs: List[Average]
    min_date: int
    max_date: int


class RiskAttributionDefinition:
    def get_all(self, data: Dict[int, DataSource]):
        return [*self.get_ind_data(data), self.get_dep_data(data)]

    def get_ind_data(self, data: Dict[int, DataSource]):
        return [data.get(i) for i in self.ind]

    def get_dep_data(self, data: Dict[int, DataSource]):
        return data.get(self.dep)

    def __init__(self, ind: List[int], dep: int, data: Dict[int, DataSource]):

        if not isinstance(ind, list) or not isinstance(dep, int):
            raise RiskAttributionInvalidInputException(
                "Wrong input type for dep or ind asset ids"
            )

        self.ind: List[int] = [int(i) for i in ind]
        self.dep: int = int(dep)

        # Also perform a check here to make sure that we have all the data needed
        if len(list(filter(lambda x: x != None, self.get_all(data)))) != (
            len(self.ind) + 1
        ):
            raise RiskAttributionUnusableInputException(
                "Missing DataSource for ind or dep asset"
            )
        return


class RiskAttributionBase:
    """RiskAttributionBase defines common functions for
    any RiskAttribution model.

    Attributes
    ----------
    defintion: `RiskAttributionDefinition`
        Defines dependent and independent variables
    data: `Dict[int,DataSource]`
        Integer-indexed dictionary of objects conforming to the DataSource
        interface.
    dates: `List[int]`
        The union of dates between all the datasets
    """

    def get_dates_union(self):
        date_lists = [set(i.get_dates()) for i in self.definition.get_all(self.data)]
        union_of_dates = set.intersection(*date_lists)
        return sorted([int(i) for i in union_of_dates])

    def get_windows(self, window_length: int):
        formatter = lambda d: list(map(list, zip(*d)))

        dep_data = self.definition.get_dep_data(self.data)
        if not dep_data:
            raise RiskAttributionUnusableInputException
        else:
            dep_length: int = dep_data.get_length()

        if dep_length < window_length:
            raise WindowLengthError

        windows = range(window_length, len(self.dates))
        for w in windows:
            window_dates = self.dates[w - window_length : w]

            dep = dep_data.find_dates(window_dates).get_returns().tolist()
            ind = []
            for i in self.definition.get_ind_data(self.data):
                if i:
                    ind.append(i.find_dates(window_dates).get_returns().tolist())
            ind = formatter(ind)
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

        dep_data = (
            self.definition.get_dep_data(self.data)
            .find_dates(self.dates)
            .get_returns()
            .tolist()
        )
        ind_data = formatter(
            [
                i.find_dates(self.dates).get_returns().tolist()
                for i in self.definition.get_ind_data(self.data)
            ]
        )
        return dep_data, ind_data

    def _run_regression(self, ind: np.ndarray, dep: np.ndarray):
        reg: LinearRegression = LinearRegression().fit(ind, dep)
        coefs = [
            RegressionCoefficient(name=str(i), coef=j, error=-1)
            for i, j in zip(self.definition.ind, reg.coef_)
        ]
        return RegressionResult(intercept=reg.intercept_, coefficients=coefs)

    def _build_data(self):
        raise NotImplementedError()

    def run(self):
        raise NotImplementedError()

    def __init__(
        self, definition: RiskAttributionDefinition, data: Dict[int, DataSource]
    ):
        self.definition: RiskAttributionDefinition = definition
        self.data: Dict[int, DataSource] = data
        self.dates: List[int] = self.get_dates_union()
        if not self.dates:
            raise RiskAttributionUnusableInputException(
                "No overlapping dates in data, cannot run analysis with inputs"
            )


class RiskAttribution(RiskAttributionBase):
    """RiskAttribution model that uses all the data for the assets
    to estimate the composition of the dependent asset's risk.

    Attributes
    ---------
    ind_data: `np.ndarray[np.ndarray[float]]`
        Formatted independent data
    dep_data: `np.ndarray[float]`
        Formatted dependent data
    """

    def _build_data(self):
        self.dep_data, self.ind_data = self.get_data()

    def run(self) -> RiskAttributionResult:
        avgs = [
            Average(name=str(i), avg=(sum(j) / len(j)))
            for i, j in zip(self.definition.ind, np.array(self.ind_data).T)
        ]
        avgs.append(
            Average(
                name=str(self.definition.dep),
                avg=(sum(self.dep_data) / len(self.dep_data)),
            )
        )
        return RiskAttributionResult(
            regression=self._run_regression(self.ind_data, self.dep_data),
            avgs=avgs,
            min_date=min(self.dates),
            max_date=max(self.dates),
        )

    def __init__(self, ind: List[int], dep: int, data: Dict[int, DataSource]):
        definition: RiskAttributionDefinition = RiskAttributionDefinition(
            ind, dep, data
        )
        super().__init__(definition, data)
        self._build_data()


class RollingRiskAttributionResult(TypedDict):
    regressions: List[RegressionResult]
    min_date: int
    max_date: int
    dates: List[int]


class RollingRiskAttribution(RiskAttributionBase):
    """RiskAttribution model that calculated the composition
    of the dependent asset's risk over rolling periods of N
    length.

    Attributes
    --------
    window_length : int
        Length of the rolling windows over which the analysis will run
    """

    def run(self) -> RollingRiskAttributionResult:
        regressions: List[RegressionResult] = []
        for dep, ind in self.get_windows(self.window_length):
            regressions.append(self._run_regression(ind, dep))
        # Rolling window won't have the first N dates
        clipped_dates: List[int] = self.dates[self.window_length :]
        return RollingRiskAttributionResult(
            regressions=regressions,
            min_date=min(clipped_dates),
            max_date=max(clipped_dates),
            dates=clipped_dates
        )

    def __init__(
        self, ind: List[int], dep: int, data: Dict[int, DataSource], window_length: int
    ):

        definition: RiskAttributionDefinition = RiskAttributionDefinition(
            ind, dep, data
        )
        super().__init__(definition, data)
        self.window_length: int = window_length


class BootstrapRiskAttribution(RiskAttributionBase):
    """RiskAttribution model that constructs a bootstrap estimates
    of the dependent asset's risk using the result of the
    RollingRiskAttribution run

    Attributes
    --------
    window_length : int
        Length of the rolling windows over which the analysis will run
    results : `Optional[RollingRiskAttributionResults]`
        Results of the rolling regression
    bootstrap : `Optional[np.ndarray]`
       Bootstrap
    """

    def _build_bootstrap(self):
        def _bootstrap_func(x: np.ndarray) -> np.ndarray:
            return np.array([i.numpy_arr() for i in x]).mean(axis=0)
        
        """
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
        """
        intercepts = np.array([[i['intercept'] for i in self.results['regressions']]])
        coefs = np.array([[j['coef']] for i in self.results['regressions'] for j in i['coefficients']]).T
        merged = np.concatenate((intercepts, coefs), axis=0)
        bootstrap = IIDBootstrap(merged)
        bootstrap_results = bootstrap.conf_int(lambda x: x.mean(axis=0), method="bc").T
        ind_variable_cnt: int = len(self.definition.ind)
        results: np.ndarray = np.array(
            [bootstrap_results[0], *bootstrap_results[1 : 1 + ind_variable_cnt]]
        )
        print(merged)
        print(results)
        print(bootstrap_results)

    def run(self) -> BootstrapRiskAttributionResults:
        rra: RollingRiskAttribution = RollingRiskAttribution(
            ind=self.definition.ind,
            dep=self.definition.dep,
            data=self.data,
            window_length=self.window_length,
        )
        self.results: RollingRiskAttributionResult = rra.run()
        self._build_bootstrap()
        return BootstrapRiskAttributionResults(self)

    def __init__(
        self, ind: List[int], dep: int, data: Dict[int, DataSource], window_length: int
    ):
        definition: RiskAttributionDefinition = RiskAttributionDefinition(
            ind, dep, data
        )
        super().__init__(definition, data)
        self.window_length: int = window_length
        self.results: Optional[RollingRiskAttributionResult] = None
        self.bootstrap: Optional[np.ndarray] = None
