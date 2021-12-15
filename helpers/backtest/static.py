from typing import List, Tuple, Union

from rust import staticweight_backtest, max_dd_threshold_position
from .base import BackTestResults, BackTestInvalidInputException


def asset_return_to_price(rets: List[float]) -> List[float]:
    base: float = 1.0
    temp: List[float] = []
    for i, r in enumerate(rets):
        if not temp:
            temp.append(base)
        base = base * (1 + (r / 100))
        temp.append(base)
    return temp


class StaticPortfolioBackTest:
    """Backtest data is fixed by the caller. Static backtest means that
    the weights are fixed at the time the backtest is created.

    Attributes
    ---------
    assets : `List[str]`
        List of assetids in string format prefixed with 'EQ:`
    weights : `List[float]`
        List of portfolio weights in decimal form.
    price_request : `prices.PriceAPIRequests`
        Object that determines how the request for a Coverage object is fulfilled

    Raises
    ---------
    BackTestInvalidInputException
        Either weights or assets is missing or not formatted
    """

    def get_max_dd_threshold_position(
        self, threshold: float
    ) -> List[Tuple[float, float, float]]:
        port_returns: List[float] = self.results["returns"]
        return max_dd_threshold_position(port_returns, threshold)  # type: ignore

    def run(self) -> None:
        bt: Tuple[
            float, float, float, float, float, List[float], List[float], List[int]
        ] = staticweight_backtest(self.weights, self.prices)
        self.results: BackTestResults = BackTestResults(
            ret=bt[0],
            cagr=bt[1],
            vol=bt[2],
            mdd=bt[3],
            sharpe=bt[4],
            values=bt[5],
            returns=bt[6],
            dates=bt[7],
        )
        return

    def __init__(
        self,
        weights: List[List[float]],
        sample_returns: List[List[float]],
    ):
        if not weights or not sample_returns:
            raise BackTestInvalidInputException
        self.weights: List[List[float]] = []

        if isinstance(weights[0], float):
            for i in sample_returns:
                self.weights.append(i)
        else:
            if len(weights) != len(sample_returns):
                raise BackTestInvalidInputException
            else:
                for i in weights:
                    self.weights.append(i)

        into_prices: List[List[float]] = []
        ##Adding list of zeros onto end so that simulation runs for all returns
        self.weights.append([0 for i in self.weights[0]])

        transposed_returns: List[List[float]] = list(map(list, zip(*sample_returns)))
        for asset_returns in transposed_returns:
            into_prices.append(asset_return_to_price(asset_returns))

        transposed_into_prices: List[List[float]] = list(map(list, zip(*into_prices)))

        self.prices = transposed_into_prices
