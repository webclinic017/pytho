import numpy as np


class RegressionResults:
    def numpy_arr(self):
        flatten_dict = lambda x: [
            list(x[i].values()) if isinstance(x[i], dict) else [x[i]]
            for i in x
        ]
        flattened_avgs = sum(flatten_dict(self.avgs), [])
        return np.array(
            [
                self.intercept,
                *np.array(list(self.coef.values())),
                *np.array(list(flattened_avgs)),
            ]
        )

    def as_dict(self):
        return {
            "intercept": self.intercept,
            "coef": self.coef,
            "avgs": self.avgs,
        }

    def json(self):
        return json.dumps(as_dict())

    def __init__(self, intercept, coef, avgs):
        self.intercept = intercept
        self.coef = coef
        self.avgs = avgs
        return


class RiskAttributionResults:
    def get_results(self):
        return {
            "core": self.model.results.as_dict(),
            "min_date": min(self.model.dates),
            "max_date": max(self.model.dates),
        }

    def __init__(self, model):
        """RiskAttribution model results.

        Parameters
        ----------
        model: `RiskAttribution`
          Instance of a standard RiskAttribution class.
        """
        self.model = model
        return


class RollingRiskAttributionResults:
    def get_results(self):
        return {
            "rolling": [i.as_dict() for i in self.model.results],
            "min_date": min(self.model.dates),
            "max_date": max(self.model.dates),
            "dates": self.model.dates,
        }

    def __getitem__(self, i):
        return self.model.results[i]

    def __len__(self):
        return len(self.model.results)

    def __iter__(self):
        for i in self.model.results:
            yield i

    def __init__(self, model):
        """RollingRiskAttribution model results.

        Parameters
        ----------
        model: `RollingRiskAttribution`
          Instance of a standard RollingRiskAttribution class.
        """
        self.model = model
        return


class BootstrapRiskAttributionResults:
    def get_results(self):
        res = {}
        res["min_date"] = min(self.model.dates)
        res["max_date"] = max(self.model.dates)
        res["bootstrap"] = {}
        res["bootstrap"]["ind"] = list(self.model.bootstrap[0])
        res["bootstrap"]["dep"] = {}
        for i, j in enumerate(self.model.definition.ind):
            res["bootstrap"]["dep"][j] = list(self.model.bootstrap[i + 1])
        return res

    def __init__(self, model):
        """BootstrapRiskAttribution model results.

        Parameters
        ----------
        model: `BootstrapRiskAttribution`
          Instance of a standard BootstrapRiskAttribution class.
        """
        self.model = model
        return
