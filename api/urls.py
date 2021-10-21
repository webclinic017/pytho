from django.urls import path

from api import views

urlpatterns = [
    path("chartshare", views.chartshare),
    path("riskattribution", views.risk_attribution),
    path("rollingriskattribution", views.rolling_risk_attribution),
    path("bootstrapriskattribution", views.bootstrap_risk_attribution),
    path("backtest", views.backtest_portfolio),
    path("pricecoveragesuggest", views.price_coverage_suggest),
    path("portfoliosim", views.portfolio_simulator),
    path("hypotheticaldrawdown", views.hypothetical_drawdown_simulation),
]
