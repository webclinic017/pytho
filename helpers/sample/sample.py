from typing import List, Any, TypedDict
from django.db.backends.utils import CursorWrapper
from django.db.models import Q
from django.db import connection

from api.models import RealReturns
from .rawsql.rawsql import SQLReader


class Sample(TypedDict):
    country: str
    start: int
    end: int


class SampleByCountryYear:
    @staticmethod
    def get_countries() -> List[Sample]:
        sample_query: str = SQLReader.get_sample_periods()
        cur: CursorWrapper = connection.cursor()
        cur.execute(sample_query)
        resp: List[Sample] = [
            Sample(country=i[1], start=i[2], end=i[3]) for i in cur.fetchall()
        ]
        return resp

    def build(self) -> List[List[float]]:
        query_result: List[RealReturns] = RealReturns.objects.filter(
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

        temp: List[List[float]] = [[], [], [], []]
        for row in query_result:
            for i, (start, end, country) in enumerate(
                zip(self.start_years, self.end_years, self.countries)
            ):
                if row.country == country and row.year >= start and row.year <= end:
                    if i == 0 or i == 1:
                        temp[i].append(row.eq_tr_local * 100)
                    else:
                        temp[i].append(row.bond_tr_local * 100)

        transposed: List[List[float]] = list(map(list, zip(*temp)))
        return transposed

    def __init__(self, samples: List[Sample]):
        self.samples = samples
        self.countries = [i["country"] for i in samples]
        self.start_years = [i["start"] for i in samples]
        self.end_years = [i["end"] for i in samples]
        return
