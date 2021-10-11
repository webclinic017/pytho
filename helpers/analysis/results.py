
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
