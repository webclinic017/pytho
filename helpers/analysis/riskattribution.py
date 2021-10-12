import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from typing import List, Dict, TypedDict
from arch.bootstrap import IIDBootstrap

from helpers.prices.data import DataSource


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
    averages: List[List[Average]]


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
        avgs: List[List[Average]] = []
        for dep, ind in self.get_windows(self.window_length):
            avg_group = [
                Average(name=str(i), avg=(sum(j) / len(j)))
                for i, j in zip(self.definition.ind, np.array(ind).T)
            ]
            avg_group.append(
                Average(
                    name=str(self.definition.dep),
                    avg=(sum(dep) / len(dep)),
                )
            )
            avgs.append(avg_group)

            regressions.append(self._run_regression(ind, dep))
        # Rolling window won't have the first N dates
        clipped_dates: List[int] = self.dates[self.window_length :]
        return RollingRiskAttributionResult(
            regressions=regressions,
            averages=avgs,
            min_date=min(clipped_dates),
            max_date=max(clipped_dates),
            dates=clipped_dates,
        )

    def __init__(
        self, ind: List[int], dep: int, data: Dict[int, DataSource], window_length: int
    ):

        definition: RiskAttributionDefinition = RiskAttributionDefinition(
            ind, dep, data
        )
        super().__init__(definition, data)
        self.window_length: int = window_length


class BootstrapResult(TypedDict):
    name: str
    lower: float
    upper: float


class BootstrapRiskAttributionResult(TypedDict):
    intercept: BootstrapResult
    coefficients: List[BootstrapResult]


class BootstrapRiskAttribution(RiskAttributionBase):
    """RiskAttribution model that constructs a bootstrap estimates
    of the dependent asset's risk using the result of the
    RollingRiskAttribution run

    Attributes
    --------
    window_length : int
        Length of the rolling windows over which the analysis will run
    """

    def _get_coefs_from_rolling_results(
        self, rolling: RollingRiskAttributionResult
    ) -> np.ndarray:
        coefs: List[List[float]] = []
        for reg in rolling["regressions"]:
            temp: List[float] = []
            for coef in reg["coefficients"]:
                temp.append(coef["coef"])
            coefs.append(temp)
        return np.array(coefs).T

    def _get_avgs_from_rolling_results(
        self, rolling: RollingRiskAttributionResult
    ) -> np.ndarray:
        avgs: List[List[float]] = []
        for avg_group in rolling["averages"]:
            temp: List[float] = []
            for avg in avg_group:
                temp.append(avg["avg"])
            avgs.append(temp)
        return np.array(avgs).T

    def _build_bootstrap(
        self, rolling: RollingRiskAttributionResult
    ) -> BootstrapRiskAttributionResult:
        """Each data point is a list of lists. We can have one intercept but need to put
        that into a list so we can merge it later. We can have multiple coefs and avgs
        so these naturally go into a list of lists. Each row is one coefficient or one average,
        and the columns are the length of the dataset.
        We then concat and transpose so each col is of length # of coefs + # of avgs + 1 (for intercept),
        and the number of rows is the length of the dataset.
        We then put this into bootstrap which calculates the mean for each column, and then uses
        this to construct bootstrap estimates. The length of the estimates is equal to
        # of coefs + # of avgs + 1 (for intercept). We transpose the results so we get conf intervals
        for each variable.
        """
        intercepts: np.ndarray = np.array(
            [[i["intercept"] for i in rolling["regressions"]]]
        )
        coefs: np.ndarray = self._get_coefs_from_rolling_results(rolling)
        avgs: np.ndarray = self._get_avgs_from_rolling_results(rolling)
        merged = np.concatenate((intercepts, coefs, avgs), axis=0).T
        bootstrap: IIDBootstrap = IIDBootstrap(merged)
        bootstrap_results: np.ndarray = bootstrap.conf_int(
            lambda x: x.mean(axis=0), method="bc"
        ).T
        ind_variable_cnt: int = len(self.definition.ind)
        ##This line removes the bootstrap estimates for the averages, calculated so we can potentially
        ##add back in later

        intercept_result = BootstrapResult(
            name="alpha", lower=bootstrap_results[0][0], upper=bootstrap_results[0][1]
        )

        coefs_result = [
            BootstrapResult(
                name=str(self.definition.ind[pos]), lower=res[0], upper=res[1]
            )
            for pos, res in enumerate(bootstrap_results[1 : 1 + ind_variable_cnt])
        ]
        return BootstrapRiskAttributionResult(
            intercept=intercept_result, coefficients=coefs_result
        )

    def run(self) -> BootstrapRiskAttributionResult:
        rra: RollingRiskAttribution = RollingRiskAttribution(
            ind=self.definition.ind,
            dep=self.definition.dep,
            data=self.data,
            window_length=self.window_length,
        )
        rolling_results: RollingRiskAttributionResult = rra.run()
        return self._build_bootstrap(rolling_results)

    def __init__(
        self, ind: List[int], dep: int, data: Dict[int, DataSource], window_length: int
    ):
        definition: RiskAttributionDefinition = RiskAttributionDefinition(
            ind, dep, data
        )
        super().__init__(definition, data)
        self.window_length: int = window_length
