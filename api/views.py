from django.http import HttpResponse
from random import randrange
import json

from .models import Returns

sample_query = '''
  with random_sample as (
    select 
    * 
    from (
      select 
      country_name, 
      year, 
      lead(year, 39) over (
        partition by 
        country_name 
        order by year
      ) as end_year 
      from api_returns 
      where 
      real_eq_tr <> -1 and 
      real_bond_tr <> -1
    ) sub 
    where 
    sub.end_year is not null 
    order by random()
    limit 5
  ) 
  select 
  api_returns.id,
  api_returns.country_name, 
  api_returns.year, 
  api_returns.real_bond_tr, 
  api_returns.real_eq_tr,
  api_returns.inflation
  from api_returns 
  inner join random_sample on (
   random_sample.country_name=api_returns.country_name and 
   api_returns.year between 
   random_sample.year and 
   random_sample.end_year
  ) 
  where real_eq_tr <> -1 and 
  real_bond_tr <> -1;
'''

def _chunk_sample(data, chunk):
    res = []
    for i in range(0, len(data), chunk):
        res.append(data[i:i+chunk])
    return res

def construct_chunk_stat(data, stat):
    chunk = _chunk_sample([i.__dict__[stat] for i in data], 5)
    period_str = data[0].__dict__['country_name'] + "-" + str(data[0].__dict__['year']) + "-" + str(data[len(data)-1].__dict__['year'])
    return {"period": period_str, "data": [i for i in chunk]}

def chunksample(request):
    resp = [i for i in Returns.objects.raw(sample_query)]
    split = [resp[i:i+40] for i in range(0,200,40)]
    stats = ['real_eq_tr','real_eq_tr','real_bond_tr','real_bond_tr']
    sample = [construct_chunk_stat(split[i], stats[i]) for i in range(len(stats))]
    inflation = construct_chunk_stat(split[4], 'inflation')
    return HttpResponse(json.dumps({"inflation": inflation, "data": sample}))

def construct_stat(data, stat):
    period_str = data[0].__dict__['country_name'] + "-" + str(data[0].__dict__['year']) + "-" + str(data[len(data)-1].__dict__['year'])
    return {"period": period_str, "data": [i.__dict__[stat] for i in data]}

def sample(request):
    resp = [i for i in Returns.objects.raw(sample_query)]
    split = [resp[i:i+40] for i in range(0,200,40)]
    stats = ['real_eq_tr','real_eq_tr','real_bond_tr','real_bond_tr']
    sample = [construct_stat(split[i], stats[i]) for i in range(len(stats))]
    inflation = construct_stat(split[4], 'inflation')
    return HttpResponse(json.dumps({"inflation": inflation, "data": sample}))
