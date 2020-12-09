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
