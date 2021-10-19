import numpy as np
import numpy.typing as npt
from typing import Callable, List

Weight = List[float]
Weights = List[List[float]]
Return = List[float]
Returns = List[List[float]]
PortfolioReturns = List[float]

from helpers.portfolio.calculator.calcs.main import (
    vol,
    cum_returns,
    max_dd,
    max_dd_threshold_position,
)

rounder: Callable[[float, int], float] = lambda x, precision: round(x, precision)


class PerformanceCalculator:
    """
    Supports performance metrics. Should be a low-level
    operation that runs on matrices of returns with no knowledge about
    the actual assets.
    """

    trading_days = 253

    @staticmethod
    def _annualise_daily_volatility(daily_vol: float, precision: int = 3) -> float:
        return rounder(
            (daily_vol) * np.sqrt(PerformanceCalculator.trading_days), precision
        )

    @staticmethod
    def _annualise_daily_returns(daily_returns: float, precision: int = 3) -> float:
        return rounder(
            (((1 + (daily_returns / 100)) ** PerformanceCalculator.trading_days) - 1)
            * 100,
            precision,
        )

    @staticmethod
    def _get_cumulative_returns(returns: PortfolioReturns) -> npt.NDArray[np.float64]:
        return cum_returns(np.array(returns) / 100)

    @staticmethod
    def get_maxdd(returns: PortfolioReturns, precision: int = 3) -> float:
        return max_dd(np.array(returns) / 100, precision)

    @staticmethod
    def get_maxdd_threshold_position(
        returns: PortfolioReturns, threshold: float, precision: int = 3
    ) -> npt.NDArray[np.float64]:
        return max_dd_threshold_position(np.array(returns) / 100, precision, threshold)

    @staticmethod
    def get_volatility(returns: PortfolioReturns, precision: int = 3) -> float:
        return vol(np.array(returns), precision)

    @staticmethod
    def get_cagr(returns: PortfolioReturns, precision: int = 3) -> float:
        period_len: int = len(returns)
        total_returns: npt.NDArray[np.float64] = PerformanceCalculator._get_cumulative_returns(
            returns
        )
        total_return: float = total_returns[-1] / 1
        cagr_return: float = 0.0
        if total_return < 0:
            # We get a complex number if we take the exponent of a negative
            cagr_return = (((total_return * -1) ** (1 / period_len)) * -1) - 1
        else:
            cagr_return = (total_return ** (1 / period_len)) - 1
        return round(cagr_return * 100, precision)
