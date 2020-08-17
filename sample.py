from random import randrange
import json
import pandas as pd
import requests

def main(sample_length, asset_length):
  with_inflation = requests.get('https://pytho.uk/api/sample').json()

  returns = [i['data'] for i in with_inflation['data']]
  alloc = [0.5, 0.5, 0, 0]
  all_asset_returns = []
  for i in returns:
      asset_returns = []
      asset_weight = alloc[returns.index(i)]
      for j in i:
          period_return = asset_weight * j
          asset_returns.append(period_return)
      all_asset_returns.append(asset_returns)

  port_returns = []
  for i in range(len(all_asset_returns[0])):
      temp = 0
      for j in all_asset_returns:
          temp+=j[i]
      port_returns.append(temp)

  nominal_value = 100
  for i in port_returns:
    value_change = nominal_value * i
    nominal_value+=value_change

  return {"nominal": nominal_value}

if __name__ == "__main__":

  from multiprocessing import Pool
  with Pool(processes=6) as pool:
      args = [(40, 4) for i in range(10000)]
      res = pool.starmap(main, args)

  pd.set_option('display.float_format', lambda x: '%.3f' % x)
  df = pd.DataFrame(res)
  df.to_pickle('./equity.pkl')
  print(df.describe())
