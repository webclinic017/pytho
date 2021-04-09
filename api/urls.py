from django.urls import path

from api import views

urlpatterns = [
    path("chartshare", views.chartshare),
    path("pricehistory", views.price_history),
    path("riskattribution", views.risk_attribution),
    path("rollingriskattribution", views.rolling_risk_attribution),
    path("bootstrapriskattribution", views.bootstrap_risk_attribution),
    path("backtest", views.backtest_portfolio),
    path("pricecoverage", views.price_coverage),
    path("pricecoveragesuggest", views.price_coverage_suggest),
    path("portfoliosim", views.portfolio_simulator),
]
