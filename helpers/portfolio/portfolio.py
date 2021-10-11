from typing import List, Dict
from functools import reduce
import numpy as np

from helpers.portfolio.calculator.calculator import PerformanceCalculator


class MisshapedReturnsException(Exception):
    pass


Weight = List[float]
Weights = List[List[float]]
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

    def add_weights(self, new_weights: Weight) -> None:
        self.weights.append(new_weights)
        return

    def __init__(self, weights: Weights):

        ##Empty list isn't an error
        ##RealTimePoprtfolio starts empty
        self.weights: Weights = []
        if type(weights) is list:
            if len(weights) > 0:
                if type(weights[0][0]) is str:
                    i: List[float]
                    j: float
                    self.weights = [float(j) for j in i for i in weights]
                else:
                    self.weights = weights
        return


class PortfolioWithReturns(Portfolio):
    def get_portfolio_returns(self) -> Returns:
        """
        throws:
        * MisshapedReturnsException - this Exception should be caught
        by clients that are attempting to get returns
        """
        return ReturnCalculator.get_portfolio_returns(self)

    def get_portfolio_maxdd(self):
        returns = self.get_portfolio_returns()
        return PerformanceCalculator.get_maxdd(returns)

    def get_portfolio_volatility(self):
        returns = self.get_portfolio_returns()
        return PerformanceCalculator.get_volatility(returns)

    def get_portfolio_cagr(self):
        returns = self.get_portfolio_returns()
        return PerformanceCalculator.get_cagr(returns)

    def get_portfolio_maxdd_threshold_position(self, threshold):
        returns = self.get_portfolio_returns()
        return PerformanceCalculator.get_maxdd_threshold_position(returns, threshold)

    def add_returns(self, new_return: Return) -> None:
        self.returns.append(new_return)
        return

    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights)
        # This isn't error condition, RealTimePortfoio starts
        # with empty list
        self.returns: Returns = []

        if type(returns) is list:
            if len(returns) > 0:
                if type(returns[0][0]) is str:
                    i: List[float]
                    j: float
                    self.returns = [float(j) for j in i for i in returns]
                else:
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
        port_returns: Returns = self.get_portfolio_returns()
        new_vals = list(
            PerformanceCalculator._get_cumulative_returns(port_returns)
            * self.starting_value
        )
        rounded = [round(i, 2) for i in new_vals]
        res.extend(rounded)
        return res

    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights, returns=returns)
        self.starting_value: float = 100
        return


class PortfolioWithConstantWeightsAndMoney(PortfolioWithMoney):
    def __init__(self, weights: Weights, returns: Returns):
        weights_expanded = [weights for i in range(len(returns))]
        super().__init__(weights=weights_expanded, returns=returns)
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
    def step_forward(self, new_weights: Weight, new_return: Return) -> None:
        self.add_weights(new_weights)
        self.add_returns(new_return)
        self.period += 1
        return

    def __init__(self):
        super().__init__([], [])
        self.period = 0
        return


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
    def get_portfolio_returns(portfolio: PortfolioWithReturns) -> Returns:
        np_weights: np.ndarray[np.float64] = np.array(portfolio.weights)
        np_rets: np.ndarray[np.float64] = np.array(portfolio.returns)
        ReturnCalculator._input_check(np_weights, np_rets)
        rets: np.ndarray[np.float64] = np_weights * np_rets
        return list(map(lambda x: sum(x), rets.tolist()))
