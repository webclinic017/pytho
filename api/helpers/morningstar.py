import requests

class Morningstar:

    def _get_price_data_url(self):
        return f"https://tools.morningstar.co.uk/api/rest.svc/timeseries_price/t92wz0sj7c?currencyId=GBP&idtype=Morningstar&frequency=daily&startDate=1970-01-01&priceType=&outputType=COMPACTJSON&id={self.fund}]1]6]FOGBR$$ALL&applyTrackRecordExtension=true"

    def get_price(self):
        r = requests.get(self.get_price_data_url())
        return r.json()

    def __init__(self, fund):
        self.fund = fund
        return
