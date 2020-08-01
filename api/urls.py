from django.urls import path

from . import views

urlpatterns = [
    path('sample', views.sample),
    path('samplechunk', views.samplechunk),
    path('chartshare', views.chartshare),
    path('', views.sample)
]
