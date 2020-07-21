from django.urls import path

from . import views

urlpatterns = [
    path('sample', views.sample),
    path('chunksample', views.chunksample),
    path('', views.sample)
]
