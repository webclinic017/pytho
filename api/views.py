from django.http import HttpResponse
from random import randrange
import json

from .models import RealReturns

view_query = """
  create view real_returns as
    with er_real as (
     select 
     country_name, 
     year, 
     (1/lead(xrusd, 1) over(partition by country_name) / (1/xrusd))-1 as "curr_ret" 
     from api_returns
    ) 
    select 
    id,
    country_name,
    year,
    ((1+curr_ret)*(1+eq_tr)-1) as real_eq_tr,
    ((1+curr_ret)*(1+bond_tr)-1) as real_bond_tr
    from api_returns 
    right join er_real 
    using(country_name, year) 
    where eq_tr <> -1 and 
    bond_tr <> -1 and
    curr_ret <> -1;
"""

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
      from real_returns 
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
  real_returns.id,
  real_returns.country_name, 
  real_returns.year, 
  real_returns.real_bond_tr, 
  real_returns.real_eq_tr
  from real_returns
  inner join random_sample on (
   random_sample.country_name=real_returns.country_name and 
   real_returns.year between 
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
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    split = [resp[i:i+40] for i in range(0,200,40)]
    stats = ['real_eq_tr','real_eq_tr','real_bond_tr','real_bond_tr']
    sample = [construct_chunk_stat(split[i], stats[i]) for i in range(len(stats))]
    return HttpResponse(json.dumps({"data": sample}))

def construct_stat(data, stat):
    period_str = data[0].__dict__['country_name'] + "-" + str(data[0].__dict__['year']) + "-" + str(data[len(data)-1].__dict__['year'])
    return {"period": period_str, "data": [i.__dict__[stat] for i in data]}

def sample(request):
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    split = [resp[i:i+40] for i in range(0,200,40)]
    stats = ['real_eq_tr','real_eq_tr','real_bond_tr','real_bond_tr']
    sample = [construct_stat(split[i], stats[i]) for i in range(len(stats))]
    return HttpResponse(json.dumps({"data": sample}))
