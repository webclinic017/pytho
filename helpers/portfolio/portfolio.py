from typing import Callable, List, Dict
import numpy as np
import numpy.typing as npt

from helpers.portfolio.calculator.calculator import PerformanceCalculator


class MisshapedReturnsException(Exception):
    pass


Weight = List[float]
Weights = List[List[float]]
Return = List[float]
Returns = List[List[float]]
PortfolioReturns = List[float]
PriceAPIReturns = Dict[int, Dict[str, Dict[str, float]]]
RawReturns = Dict[int, Dict[str, Dict[str, float]]]


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

    Attributes
    --------

    weights : Weights
        List of portfolio weights for each asset in portfolio
    """

    def add_weights(self, new_weights: Weight) -> None:
        self.weights.append(new_weights)
        return

    def __init__(self, weights: Weights):

        ##Empty list isn't an error
        ##RealTimePortfolio starts empty
        self.weights: Weights = weights
        return


class PortfolioWithReturns(Portfolio):
    """Portfolio object with returns and methods to calcuate portfolio-
    level statistics

    Attributes
    ----------

    returns : Returns
        List of List of floats, each row is a period, and each column is
        an asset
    """

    def get_portfolio_returns(self) -> PortfolioReturns:
        """
        throws:
        * MisshapedReturnsException - this Exception should be caught
        by clients that are attempting to get returns
        """
        return ReturnCalculator.get_portfolio_returns(self)

    def get_portfolio_maxdd(self) -> float:
        returns: PortfolioReturns = self.get_portfolio_returns()
        return PerformanceCalculator.get_maxdd(returns)

    def get_portfolio_volatility(self) -> float:
        returns: PortfolioReturns = self.get_portfolio_returns()
        return PerformanceCalculator.get_volatility(returns)

    def get_portfolio_cagr(self) -> float:
        returns: PortfolioReturns = self.get_portfolio_returns()
        return PerformanceCalculator.get_cagr(returns)

    def get_portfolio_maxdd_threshold_position(self, threshold: float) -> npt.NDArray[np.float64]:
        returns: PortfolioReturns = self.get_portfolio_returns()
        return PerformanceCalculator.get_maxdd_threshold_position(returns, threshold)

    def add_returns(self, new_return: Return) -> None:
        """Adds a new row of returns"""
        self.returns.append(new_return)
        return

    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights)
        # This isn't error condition, RealTimePortfoio starts
        # with empty list
        self.returns: Returns = returns


class PortfolioWithConstantWeights(PortfolioWithReturns):
    """Basic portfolio with weights and returns but has a permanent weighting of
    assets throughout.
    """

    def __init__(self, weight: Weight, returns: Returns):
        weights_expanded: Weights = [weight for i in range(len(returns))]
        super().__init__(weights=weights_expanded, returns=returns)


class PortfolioWithMoney(PortfolioWithReturns):
    """Basic portfolio with weights and returns but also adds the concept of
    money.

    Attributes
    --------

    starting_value : float
        The starting value of the portfolio
    """

    def get_values(self) -> List[float]:
        """Returns the list of portfolio values for each period of returns"""
        res: List[float] = [self.starting_value]
        port_returns: PortfolioReturns = self.get_portfolio_returns()
        rounder: Callable[[float], float] = lambda x: round(x, 2)
        new_vals: List[float] = list(
            map(
                rounder,
                list(
                    PerformanceCalculator._get_cumulative_returns(port_returns)
                    * self.starting_value
                ),
            )
        )
        res.extend(new_vals)
        return res

    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights, returns=returns)
        self.starting_value: float = 100.0


class PortfolioWithDailyReturnsFromPriceAPI(PortfolioWithMoney):
    def __init__(self, weights: Weights, returns: Returns):
        super().__init__(weights=weights, returns=returns)

    def get_portfolio_cagr(self) -> float:
        daily_return: float = super().get_portfolio_cagr()
        return PerformanceCalculator._annualise_daily_returns(daily_return)

    def get_portfolio_volatility(self) -> float:
        daily_vol: float = super().get_portfolio_volatility()
        return PerformanceCalculator._annualise_daily_volatility(daily_vol)


class PortfolioWithConstantWeightsAndMoney(PortfolioWithMoney):
    def __init__(self, weight: Weight, returns: Returns):
        weights_expanded: List[List[float]] = [weight for i in range(len(returns))]
        super().__init__(weights=weights_expanded, returns=returns)


class HistoricalPortfolioConstantWeightsPriceAPI(
    PortfolioWithDailyReturnsFromPriceAPI,
):
    def __init__(self, weight: Weight, returns: RawReturns):
        formatted_returns: List[List[float]] = []
        i: int
        for i in returns:
            daily_rets_dict: Dict[str, float] = returns[i]["daily_rt"]
            rets: List[float] = [daily_rets_dict[j] for j in daily_rets_dict]
            formatted_returns.append(rets)
        transpose_returns: List[List[float]] = list(map(list, zip(*formatted_returns)))

        weights_expanded: List[List[float]] = [
            weight for i in range(len(transpose_returns))
        ]
        super().__init__(weights=weights_expanded, returns=transpose_returns)
        return


class RealTimePortfolio(PortfolioWithMoney):
    def step_forward(self, new_weights: Weight, new_return: Return) -> None:
        self.add_weights(new_weights)
        self.add_returns(new_return)
        self.period += 1
        return

    def __init__(self) -> None:
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
    def _input_check(weights: npt.NDArray[np.float64], returns: npt.NDArray[np.float64]) -> bool:
        if weights.shape != returns.shape:
            raise MisshapedReturnsException()
        else:
            return True

    @staticmethod
    def get_portfolio_returns(portfolio: PortfolioWithReturns) -> PortfolioReturns:
        np_weights: npt.NDArray[np.float64] = np.array(portfolio.weights, dtype=np.float64)
        np_rets: npt.NDArray[np.float64] = np.array(portfolio.returns, dtype=np.float64)
        ReturnCalculator._input_check(np_weights, np_rets)
        rets: npt.NDArray[np.float64] = np_weights * np_rets
        return list(map(lambda x: sum(x), rets.tolist()))
