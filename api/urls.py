from django.urls import path

from . import views

urlpatterns = [
    path('sample', views.sample),
    path('samplelong', views.sample_long),
    path('samplechunk', views.samplechunk),
    path('chartshare', views.chartshare),
    path('pricehistory', views.price_history),
    path('riskattribution', views.risk_attribution),
    path('pricecoverage', views.price_coverage),
    path('pricecoveragesuggest', views.price_coverage_suggest),
    path('', views.sample)
]
