select 
* 
from (
  select 
  id,
  country, 
  year, 
  lead(year, 39) over (
    partition by 
    country 
    order by year
  ) as end_year 
  from api_realreturns 
  where 
  eq_tr_local <> -1 and 
  bond_tr_local <> -1
) sub 
where 
sub.end_year is not null 
order by random()
limit 4;
