from django.urls import path

from . import views

urlpatterns = [
    path('sample', views.sample),
    path('samplelong', views.sample_long),
    path('samplechunk', views.samplechunk),
    path('chartshare', views.chartshare),
    path('', views.sample)
]
