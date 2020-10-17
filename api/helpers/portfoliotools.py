import pandas as pd
from sklearn.linear_model import LinearRegression


class RiskAttribution:
    def _date_union(self):
        date_lists = [set(self.prices[i]["daily_rt"].keys()) for i in self.prices]
        return set.intersection(*date_lists)

    def _filter_dates(self, price_dict, dates):
        temp = []
        rets = price_dict["daily_rt"]
        for d, v in zip(rets.keys(), rets.values()):
            if d in dates:
                temp.append(v)
        return temp

    def _build_data(self):

        union_dates = self._date_union()
        filtered_prices = {
            i: self._filter_dates(self.prices[i], union_dates) for i in self.prices
        }

        dep_data = filtered_prices[self.dep_var]
        ind_data = [filtered_prices[i] for i in self.ind_var]
        transpose_ind_data = list(map(list, zip(*ind_data)))

        reg = LinearRegression().fit(transpose_ind_data, dep_data)
        self.intercept = reg.intercept_
        self.coef = {i: j for i, j in zip(self.ind_var, reg.coef_)}
        self.avgs = {
            "dep": sum(dep_data) / len(dep_data),
            "ind": {i: sum(j) / len(j) for i, j in zip(self.ind_var, ind_data)},
        }
        return

    def _has_error(self):
        if dep_var and dep_var in prices.keys():
            self.error = True

    def __init__(self, dep_var, ind_var, prices):
        self.dep_var = int(dep_var)
        self.ind_var = [int(i) for i in ind_var]
        self.prices = prices
        self.error = False
        self._build_data()
        return
