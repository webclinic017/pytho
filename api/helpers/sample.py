
def _build_period_str(data):
    country_name = data[0].__dict__['country_name']
    start_year = data[0].__dict__['year']
    end_year = data[-1].__dict__['year']
    return f'{country_name}-{start_year}-{end_year}'

def _chunk_sample(data, chunk):
    res = []
    for i in range(0, len(data), chunk):
        res.append(data[i:i+chunk])
    return res

def construct_stat(data, stat):
    period_str = _build_period_str(data)
    stat_data = [i.__dict__[stat] for i in data]
    return {"period": period_str, "data": stat_data}

def construct_chunk_stat(data, stat):
    period_str = _build_period_str(data)
    chunk = _chunk_sample([i.__dict__[stat] for i in data], 5)
    return {"period": period_str, "data": [i for i in chunk]}

class SampleChunk:

    def build(self):
        return self.sample.build(construct_chunk_stat)

    def __init__(self, data, sample_period=40):
        self.sample = Sample(data, sample_period)
        return
 
class Sample:

    def build(self, func=construct_stat):
        split = [
            self.data[i:i+self.sample_period]
            for i 
            in range(0, self.sample_len, self.sample_period)]
        return [
            func(split[i], self.stats[i])
            for i
            in range(self.stat_len)]

    def __init__(self, data, sample_period = 40):
        self.data = data
        self.sample_period = sample_period
        self.stats = [
          'real_eq_tr',
          'real_eq_tr',
          'real_bond_tr',
          'real_bond_tr']
        self.stat_len = len(self.stats)
        self.sample_len = len(self.stats) * sample_period
        return
