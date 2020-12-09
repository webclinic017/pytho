create view real_returns as
  with er_real as (
    select 
    country_name, 
    year, 
    (1/lead(xrusd, 1) over(partition by country_name) / (1/xrusd))-1 as "curr_ret" 
    from api_returns
  ),
  inflation as (
    select
    year,
    (lead(cpi,1) over(partition by country_name) / cpi) -1 as "us_inflation"
    from api_returns
    where country_name = 'USA'
  )
  select 
  id,
  country_name,
  year,
  ((1 + ((1+curr_ret)*(1+eq_tr)-1)) / (1+us_inflation))-1 as real_eq_tr,
  (1 + ((1+curr_ret)*(1+bond_tr)-1) / (1+us_inflation))-1 as real_bond_tr
  from api_returns 
  right join er_real 
  using(country_name, year) 
  right join inflation
  using(year)
  where eq_tr <> -1 and 
  bond_tr <> -1 and
  curr_ret <> -1;
