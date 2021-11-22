from typing import List
from .rust_funcs import max_dd_threshold_position


def max_dd_threshold_position_wrapper(returns: List[float], threshold: float):
    return max_dd_threshold_position(returns, threshold)
