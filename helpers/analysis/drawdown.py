import numpy as np
import pandas as pd
import statsmodels.api as sm
from typing import Any, Callable, Dict, List, Tuple, TypedDict, Union

from helpers.portfolio.calculator.calcs.main import (
    max_dd_threshold_position,
)
from helpers.prices import FactorSource
from helpers.prices.data import DataSource, InvestPySource

from .riskattribution import RegressionCoefficient


class HistoricalDrawdownEstimatorFactorDataFormatter:
    @staticmethod
    def format(data: pd.DataFrame) -> pd.DataFrame:
        data["period"] = pd.to_datetime(data.index, unit="s")
        pivoted: pd.DataFrame = data.pivot(
            index="period", columns="factor", values="ret"
        )
        return pivoted


class HistoricalDrawdownEstimatorTargetDataFormatter:
    @staticmethod
    def format(data: pd.DataFrame) -> pd.DataFrame:
        data.index = pd.to_datetime(data.index, unit="s")
        return data


class DrawdownCalculator:
    @staticmethod
    def calc(data: pd.DataFrame) -> pd.DataFrame:
        return data

class PrivateDrawdownPosition(TypedDict):
    start_idx: float
    end_idx: float
    dd_size: float

class Drawdown(TypedDict):
    start: str
    end: str
    mean: float
    stdev: float
    count: int

class HistoricalDrawdownEstimatorResult(TypedDict):
    regressions: List[RegressionCoefficient]
    drawdowns: List[Drawdown]


class HistoricalDrawdownEstimator:
    """
    Uses factor loadings to simulate hypothetical past performance
    of assets.

    Attributes
    ----------
    n : int
        The number of sims to run
    target_data : `pd.DataFrame`
        The asset whose performance we are trying to simulate
    factor_data : `pd.DataFrame`
        The factors used to simulate past performance
    merged_data : `pd.DataFrame`
        The formatted join of target_data and factor_data
    factors : `list[str]`
        List of factors in factor_data
    threshold : `float`
        Drawdown that will trigger recording
    reg_mod : `sm.OLS`
        StatsModels OLS regression model
    reg_res : `sm.regression.linear_model.RegressionResultsWrapper`
        Results of fitting OLS models
    sample_coefs : `ndarray`
        Use the results of the regression to build an estimate of historical factor loadings
    hypothetical_rets : `List[PrivateDrawdownPosition]`
        List of drawdown positions, used internally, not shown to client
    hypothetical_dd_dist : `Dict[Tuple[float], Tuple[float, float, int]]`
        Distribution of hypothetical drawdowns
    """

    def __init__(
        self,
        target_data: pd.DataFrame,
        factor_data: pd.DataFrame,
        factors: List[str],
        threshold: float,
    ):
        self.n: int = 500
        self.target_data: pd.DataFrame = (
            HistoricalDrawdownEstimatorTargetDataFormatter.format(target_data)
        )
        self.factor_data: pd.DataFrame = (
            HistoricalDrawdownEstimatorFactorDataFormatter.format(factor_data)
        )
        self.factors: List[str] = factors
        self.threshold: float = threshold

        self.build_data()
        self.build_regression()
        self.build_sample_coefs()
        self.estimator_algo()
        self.calc_drawdowns()
        self.group_drawdowns()
        return

    def get_results(self) -> HistoricalDrawdownEstimatorResult:
        regressions: List[RegressionCoefficient] = []
        drawdowns: List[Drawdown] = []

        for name, coef, error in zip(
            self.reg_res.params.keys(),
            self.reg_res.params,
            self.reg_res.bse,
        ):
            rc = RegressionCoefficient(name=name, coef=coef, error=error)
            regressions.append(rc)

        for period in self.hypothetical_dd_dist:
            dd_start = int(period[0])
            dd_end = int(period[1])
            data_slice = self.factor_data.iloc[dd_start:dd_end]
            start_date = str(data_slice.iloc[0].name)
            end_date = str(data_slice.iloc[-1].name)
            dd_data = self.hypothetical_dd_dist[period]
            drawdown = Drawdown(
                start=start_date,
                end=end_date,
                mean=dd_data[0],
                stdev=dd_data[1],
                count=dd_data[2],
            )
            drawdowns.append(drawdown)
        return HistoricalDrawdownEstimatorResult(
            regressions=regressions,
            drawdowns=drawdowns
        )

    def build_data(self) -> None:
        self.merged_data: pd.DataFrame = self.target_data.merge(
            self.factor_data,
            how="left",
            left_index=True,
            right_on="period",
        )
        self.merged_data.dropna(inplace=True)
        self.factor_rets: np.ndarray = self.factor_data[self.factors].values
        return

    def build_regression(self) -> None:
        X: pd.DataFrame = sm.add_constant(self.merged_data[self.factors])
        y: pd.DataFrame = self.merged_data[["daily_rt"]]
        self.reg_mod: sm.OLS = sm.OLS(y, X)
        self.reg_res: sm.regression.linear_model.RegressionResultsWrapper = (
            self.reg_mod.fit()
        )
        return

    def build_sample_coefs(self) -> None:
        temp: List[np.ndarray] = []
        for i, j in zip(self.reg_res.params, self.reg_res.bse):
            temp.append(np.random.normal(i, j, self.n))
        self.sample_coefs: np.ndarray = np.array(temp)
        return

    def estimator_algo(self) -> None:
        temp: List[np.ndarray] = []
        for i in self.sample_coefs.T:
            sample_factor_weights: np.ndarray = i[1:]
            sample_factor_rets: np.ndarray = np.sum(
                sample_factor_weights * self.factor_rets, axis=1
            )
            temp.append(sample_factor_rets)
        self.hypothetical_rets: List[np.ndarray] = temp
        return

    def calc_drawdowns(self) -> None:
        self.hypothetical_dd: List[PrivateDrawdownPosition] = []
        for i in self.hypothetical_rets:
            dd_group: List[List[float]] = max_dd_threshold_position(
                i / 100,
                3,
                self.threshold,
            )
            if dd_group:
                for dd in dd_group:
                    dd_pos: PrivateDrawdownPosition = PrivateDrawdownPosition(
                        start_idx=dd[0],
                        end_idx=dd[1],
                        dd_size=dd[2]
                    )
                    self.hypothetical_dd.append(dd_pos)
        return

    def group_drawdowns(self) -> None:
        does_match: Callable[[Tuple[float, float], Tuple[float, float], int], bool] = (
            lambda dd, match, pos: match[pos] > dd[pos] - 5 and match[pos] < dd[pos] + 5
        )
        res: Dict[Tuple[float, float], np.ndarray] = {}
        for dd in self.hypothetical_dd:
            has_match: bool = False
            position: Tuple[float, float] = (dd['start_idx'], dd['end_idx'])
            for k in res:
                if does_match(k, position, 0):
                    has_match = True
                    res[k] = np.append(res[k], dd['dd_size']) #type: ignore
            if not has_match:
                res[position] = np.array([dd['dd_size']])

        boundary: int = 0
        self.hypothetical_dd_dist: Dict[Tuple[float, float], Tuple[float, float, int]] = {
            i: (res[i].mean(), res[i].std(), len(res[i]))
            for i in res
            if len(res[i]) > boundary
        }
        return


class HistoricalDrawdownEstimatorFromDataSources(HistoricalDrawdownEstimator):
    """
    Converts a dictionary of datasources into a HistoricalDrawdownEstimator.
    This supports one InvestPySource and N FactorSource objects. Throws
    an error when trying to estimate historical drawdown using non-factor
    sources.

    It is possible to use non-factor sources here but there isn't much
    reason to do since factors have a strong relationship with asset returns
    and other sources may not.
    """

    def __init__(
        self,
        model_prices: Dict[int, DataSource],
        threshold: float,
    ):
        """
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
        flatten: Callable[[List[np.ndarray]], List[Any]] = lambda t: [item for sublist in t for item in sublist]
        factor_count: int = len(
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
        factors: List[str] = flatten(
            [i.get_factors() for i in ind_prices if isinstance(i, FactorSource)]
        )
        factor_data: pd.DataFrame = pd.DataFrame({})
        if len(ind_prices) > 1:
            get_prices: Callable[[DataSource], pd.DataFrame] = lambda x: x.get_prices()
            factor_data = pd.concat(list(map(get_prices, ind_prices)))
        else:
            factor_data = ind_prices[0].get_prices()
        super().__init__(dep_prices.get_returns(), factor_data, factors, threshold)
        return
