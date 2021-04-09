from models import FactorReturns
from helpers.data.factors.ff.main import (
    FF3FactorDailyData,
    FFUnivariateSizeDailyData,
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

if __name__ == "__main__":

    ff = FF3FactorDailyData()
    print(ff.df)
