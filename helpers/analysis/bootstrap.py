from typing import Generator, Optional
import numpy as np
import numpy.typing as npt
import statsmodels.api as sm
from scipy.stats import bootstrap


class SemiParametricBootstrap:
    @staticmethod
    def run(
        y: npt.NDArray[np.float64],
        x: npt.NDArray[np.float64],
        runs: Optional[int] = 100,
    ) -> None:
        np.set_printoptions(precision=3)
        x_with_constant: npt.NDArray[np.float64] = sm.add_constant(x)
        init_reg: sm.OLS = sm.OLS(y, x_with_constant)
        init_res: sm.regression.linear_model.RegressionResult = init_reg.fit()
        resid: npt.NDArray[np.float64] = init_res.resid
        temp_params: npt.NDArray[np.float64] = init_res.params
        pred: npt.NDArray[np.float64] = init_reg.predict(temp_params)

        rng: Generator = np.random.default_rng()
        temp = np.array([])
        for i in range(runs):
            t: npt.NDArray[np.float64] = rng.choice(a=resid, size=len(y), replace=True)
            # y_star = np.dot(x_with_constant, temp_params) + t
            y_star = pred + t

            reg = sm.OLS(y_star, x_with_constant)
            res = reg.fit()
            temp_params = res.params
            temp = np.append(temp, temp_params)
        res = temp.reshape(runs, len(x[0]) + 1)
        return bootstrap((res,), np.mean, method="basic", axis=0, confidence_level=0.95)
