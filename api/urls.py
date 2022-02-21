from django.urls import path

from api import views

urlpatterns = [
    path("riskattribution", views.risk_attribution),
    path("backtest", views.backtest_portfolio),
    path("pricecoveragesuggest", views.price_coverage_suggest),
    path("hypotheticaldrawdown", views.hypothetical_drawdown_simulation),
    path("hermessuggest", views.hermes_suggest),
    path("hermesdailyprice", views.hermes_daily_price),
    path("hermesfundamentals", views.hermes_fundamentals),
    path("hermesearnings", views.hermes_earnings),
    path("hermessummary", views.hermes_summary),
    path("hermesholders", views.hermes_holders),
]
