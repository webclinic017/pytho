import functools
import os

import numpy as np
import pandas as pd
import pytz
from qstrader import settings


class InvestPyDailyBarDataSource(object):
    def _format_df_dictionary(self):
        self.asset_bid_ask_frames = {}
        for i in self.df_dictionary:
            df = self.df_dictionary[i]
            df.reset_index(inplace=True)
            df.rename(columns={"time": "Date"}, inplace=True)

            df["Date"] = df["Date"].apply(
                lambda x: pd.Timestamp(x, tz=pytz.UTC, unit="s")
            )
            df.set_index("Date", inplace=True)

            oc_df = df.loc[:, ["Open", "Close"]]
            seq_oc_df = oc_df.T.unstack(level=0).reset_index()
            seq_oc_df.columns = ["Date", "Market", "Price"]
            seq_oc_df.loc[
                seq_oc_df["Market"] == "Open", "Date"
            ] += pd.Timedelta(hours=14, minutes=30)
            seq_oc_df.loc[
                seq_oc_df["Market"] == "Close", "Date"
            ] += pd.Timedelta(hours=21, minutes=00)

            dp_df = seq_oc_df[["Date", "Price"]]
            dp_df["Bid"] = dp_df["Price"]
            dp_df["Ask"] = dp_df["Price"]
            dp_df = (
                dp_df.loc[:, ["Date", "Bid", "Ask"]]
                .fillna(method="ffill")
                .set_index("Date")
                .sort_index()
            )
            self.asset_bid_ask_frames["EQ:" + str(i)] = dp_df
        return

    def __init__(self, df_dictionary):
        self.df_dictionary = df_dictionary
        self._format_df_dictionary()
        return

    @functools.lru_cache(maxsize=1024 * 1024)
    def get_bid(self, dt, asset):
        bid_ask_df = self.asset_bid_ask_frames[asset]
        try:
            bid = bid_ask_df.iloc[
                bid_ask_df.index.get_loc(dt, method="pad")
            ]["Bid"]
        except KeyError:  # Before start date
            return np.NaN
        return bid

    @functools.lru_cache(maxsize=1024 * 1024)
    def get_ask(self, dt, asset):
        bid_ask_df = self.asset_bid_ask_frames[asset]
        try:
            ask = bid_ask_df.iloc[
                bid_ask_df.index.get_loc(dt, method="pad")
            ]["Ask"]
        except KeyError:  # Before start date
            return np.NaN
        return ask
