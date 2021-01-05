from typing import List, Dict
from functools import reduce
import numpy as np


class MisshapedReturnsException(Exception):
    pass


Weight = List[float]
Weights = List[Weight]
Return = List[float]
Returns = List[List[float]]
PriceAPIReturns = Dict[int, Dict[str, Dict[str, float]]]


class Portfolio:
    """
    Most fundamental implementation of a portfolio: a matrix of weights
    over time which can then be a multiplied by prices to obtain returns.

    * Returns come from somewhere else but we wrap the return calculation
    so this object can be composed into performance calculations.

    * Can be intialised with values or start from zero. It should be
    act the same in either case.

    * Shouldn't have any reference to the name of assets, the actual
    implementation for the user which knows details is wrapped around
    this.
    """

    def get_portfolio_returns(self, returns: Returns) -> Returns:
        """
        throws:
        * MisshapedReturnsException - this Exception should be caught
        by clients that are attempting to get returns
        """
        return ReturnCalculator.get_portfolio_returns(self, returns)

    def add_weights(self, new_weights: Weight) -> None:
        self.weights.append(new_weights)
        return

    def __init__(self, weights: Weights):
        self.weights: Weights = weights
        return


class PortfolioWithReturns(Portfolio):
    def get_portfolio_maxdd(self):
        returns = self.get_portfolio_returns(self.returns)
        return PerformanceCalculator.get_maxdd(returns)

    def get_portfolio_volatility(self):
        returns = self.get_portfolio_returns(self.returns)
        return PerformanceCalculator.get_volatility(returns)

    def get_portfolio_cagr(self):
        returns = self.get_portfolio_returns(self.returns)
        return PerformanceCalculator.get_cagr(returns)

    def add_returns(self, new_return: Return) -> None:
        self.returns.append(new_return)
        return

    def __init__(self, weights: Weights, returns: Returns, **kwds):
        super().__init__(weights=weights, **kwds)
        self.returns = returns
        return


class PortfolioWithConstantWeights(PortfolioWithReturns):
    def __init__(self, weights: Weights, returns: Returns):
        weights_expanded = [weights for i in range(len(returns))]
        super().__init__(weights=weights_expanded, returns=returns)
        return


class PortfolioWithMoney(PortfolioWithReturns):
    def get_values(self) -> List[float]:
        res = [self.starting_value]
        port_returns: Returns = self.get_portfolio_returns(self.returns)
        new_vals = list(
            PerformanceCalculator._get_cumulative_returns(port_returns)
            * self.starting_value
        )
        res.extend(new_vals)
        return res

    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights, returns=returns)
        self.starting_value: float = 100
        return


class PortfolioWithDailyReturnsFromPriceAPI(PortfolioWithMoney):
    def __init__(self, weights: Weights, returns: Returns):
        formatted_returns = []
        for i in returns:
            daily_rets_dict = returns[i]["daily_rt"]
            rets = [daily_rets_dict[j] for j in daily_rets_dict]
            formatted_returns.append(rets)
        transpose_returns = list(map(list, zip(*formatted_returns)))
        super().__init__(weights=weights, returns=transpose_returns)
        return

    def get_portfolio_cagr(self):
        daily_return = super().get_portfolio_cagr()
        return PerformanceCalculator._annualise_daily_returns(daily_return)

    def get_portfolio_volatility(self):
        daily_vol = super().get_portfolio_volatility()
        return PerformanceCalculator._annualise_daily_volatility(daily_vol)


class HistoricalPortfolioConstantWeightsPriceAPI(
    PortfolioWithDailyReturnsFromPriceAPI,
    PortfolioWithConstantWeights,
):
    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights, returns=returns)
        return


class RealTimePortfolio(PortfolioWithMoney):
    def step_forward(
        self, new_weights: Weight, new_return: Return
    ) -> None:
        self.add_weights(new_weights)
        self.add_returns(new_return)
        self.period += 1
        return

    def __init__(self):
        super().__init__([], [])
        self.period = 0
        return


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
        return np.cumprod((np.array(returns) * 0.01) + 1)

    @staticmethod
    def get_maxdd(returns: Returns, precision: int = 3) -> float:
        maxdd = 0
        total_returns = PerformanceCalculator._get_cumulative_returns(
            returns
        )
        for i in range(len(returns)):
            for j in range(len(returns)):
                if i != j and i < j:
                    total_return = (
                        total_returns[j] / total_returns[i]
                    ) - 1
                    if total_return < maxdd:
                        maxdd = total_return
        return round(maxdd * 100, precision)

    @staticmethod
    def get_volatility(returns: Returns, precision: int = 3) -> float:
        return round(np.std(np.array(returns)), precision)

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


class ReturnCalculator:
    """
    Supports all the basic formats of return calculation. Should be a
    very low-level operation that runs on matrices of returns and
    weights with no knowledge about the actual assets.
    """

    @staticmethod
    def _input_check(weights: np.ndarray, returns: np.ndarray) -> bool:
        if weights.shape != returns.shape:
            raise MisshapedReturnsException()
        else:
            return True

    @staticmethod
    def get_portfolio_returns(
        portfolio: Portfolio, returns: Returns
    ) -> Returns:
        np_weights: np.ndarray[np.float64] = np.array(portfolio.weights)
        np_rets: np.ndarray[np.float64] = np.array(returns)
        ReturnCalculator._input_check(np_weights, np_rets)
        rets: np.ndarray[np.float64] = np_weights * np_rets
        return list(map(lambda x: sum(x), rets.tolist()))
