from django.db.models import Q
from django.db import connection

from api.models import RealReturns
from .rawsql.rawsql import SQLReader


class SampleByCountryYear:
    @staticmethod
    def get_countries():
        sample_query = SQLReader.get_sample_periods()
        cur = connection.cursor()
        cur.execute(sample_query)
        resp = [[i[1], i[2], i[3]] for i in cur.fetchall()]
        return list(map(list, zip(*resp)))

    def build(self):
        query_result = RealReturns.objects.filter(
            Q(
                country=self.countries[0],
                year__range=(self.start_years[0], self.end_years[0]),
            )
            | Q(
                country=self.countries[1],
                year__range=(self.start_years[1], self.end_years[1]),
            )
            | Q(
                country=self.countries[2],
                year__range=(self.start_years[2], self.end_years[2]),
            )
            | Q(
                country=self.countries[3],
                year__range=(self.start_years[3], self.end_years[3]),
            )
        )

        temp = [[], [], [], []]
        for row in query_result:
            for i, (start, end, country) in enumerate(
                zip(self.start_years, self.end_years, self.countries)
            ):
                if row.country == country and row.year >= start and row.year <= end:
                    if i == 0 or i == 1:
                        temp[i].append(row.eq_tr_local * 100)
                    else:
                        temp[i].append(row.bond_tr_local * 100)

        transposed = list(map(list, zip(*temp)))
        return transposed

    def __init__(self, countries, start_years, end_years):
        self.start_years = start_years
        self.end_years = end_years
        self.countries = countries
        return
