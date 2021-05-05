import numpy as np
from typing import List, Dict

Weight = List[float]
Weights = List[List[float]]
Return = List[float]
Returns = List[List[float]]

from helpers.portfolio.calculator.calcs.main import (
    vol,
    cum_returns,
    max_dd,
    max_dd_threshold_position,
)


class PerformanceCalculator:
    """
    Supports performance metrics. Should be a low-level
    operation that runs on matrices of returns with no knowledge about
    the actual assets.
    """

    trading_days = 253

    @staticmethod
    def _annualise_daily_volatility(
        daily_vol: float, precision: int = 3
    ) -> float:
        return (daily_vol) * np.sqrt(PerformanceCalculator.trading_days)

    @staticmethod
    def _annualise_daily_returns(
        daily_returns: float, precision: int = 3
    ) -> float:
        return round(
            (
                (
                    (1 + (daily_returns / 100))
                    ** PerformanceCalculator.trading_days
                )
                - 1
            )
            * 100,
            precision,
        )

    @staticmethod
    def _get_cumulative_returns(returns: Returns) -> np.ndarray:
        return cum_returns(np.array(returns) / 100)

    @staticmethod
    def get_maxdd(returns: Returns, precision: int = 3) -> float:
        return max_dd(np.array(returns) / 100, precision)

    @staticmethod
    def get_maxdd_threshold_position(
        returns: Returns, threshold, precision: int = 3
    ) -> List[List[int]]:
        return max_dd_threshold_position(
            np.array(returns) / 100, precision, threshold
        )

    @staticmethod
    def get_volatility(returns: Returns, precision: int = 3) -> float:
        return vol(np.array(returns), precision)

    @staticmethod
    def get_cagr(returns: Returns, precision: int = 3) -> float:
        period_len = len(returns)
        total_returns = PerformanceCalculator._get_cumulative_returns(
            returns
        )
        total_return = total_returns[-1] / 1
        if total_return < 0:
            # We get a complex number if we take the exponent of a negative
            cagr_return = (
                ((total_return * -1) ** (1 / period_len)) * -1
            ) - 1
        else:
            cagr_return = (total_return ** (1 / period_len)) - 1
        return round(cagr_return * 100, precision)
