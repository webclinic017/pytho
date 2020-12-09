from django.urls import path

from . import views

urlpatterns = [
    path("sample", views.sample_main),
    path("samplelong", views.sample_long),
    path("samplechunk", views.sample_chunk),
    path("chartshare", views.chartshare),
    path("pricehistory", views.price_history),
    path("riskattribution", views.risk_attribution),
    path("rollingriskattribution", views.rolling_risk_attribution),
    path("bootstrapriskattribution", views.bootstrap_risk_attribution),
    path("pricecoverage", views.price_coverage),
    path("pricecoveragesuggest", views.price_coverage_suggest),
    path("", views.sample_main),
]
