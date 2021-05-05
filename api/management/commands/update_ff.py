from api.models import FactorReturns
from helpers.data.factors.ff import (
    FF3FactorDailyData,
    FFDeveloped5FactorDailyData,
    FFDevelopedExUs5FactorDailyData,
    FFEuropean5FactorDailyData,
    FFJapanese5FactorDailyData,
    FFAsiaPacificExJapan5FactorDailyData,
    FFNorthAmerica5FactorDailyData,
    FFDevelopedMomentumFactorDailyData,
    FFDevelopedExUsMomentumFactorDailyData,
    FFEuropeanMomentumFactorDailyData,
    FFJapaneseMomentumFactorDailyData,
    FFAsiaPacificExJapanMomentumFactorDailyData,
    FFNorthAmericaMomentumFactorDailyData,
    FFInternationalCountriesMonthlyData,
)

from django.core.management.base import BaseCommand

from api.models import FactorReturns

datasets = [
    FF3FactorDailyData,
    FFDeveloped5FactorDailyData,
    FFDevelopedExUs5FactorDailyData,
    FFEuropean5FactorDailyData,
    FFJapanese5FactorDailyData,
    FFAsiaPacificExJapan5FactorDailyData,
    FFNorthAmerica5FactorDailyData,
    FFDevelopedMomentumFactorDailyData,
    FFDevelopedExUsMomentumFactorDailyData,
    FFEuropeanMomentumFactorDailyData,
    FFJapaneseMomentumFactorDailyData,
    FFAsiaPacificExJapanMomentumFactorDailyData,
    FFNorthAmericaMomentumFactorDailyData,
    FFInternationalCountriesMonthlyData,
]


def insert_flow(o):
    print(o)
    ff = o()
    d = ff.df.to_dict("records")
    frs = [FactorReturns(**i) for i in d]
    FactorReturns.objects.bulk_create(frs, ignore_conflicts=True)
    return


class Command(BaseCommand):
    def handle(self, *args, **options):
        [insert_flow(d) for d in datasets]
        return
