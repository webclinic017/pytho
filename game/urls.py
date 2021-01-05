from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("fortyannual", views.fortyannual, name="fortyannual"),
    path("portfolioshare", views.portfolioshare, name="portfolioshare"),
    path("backtest", views.backtest, name="backtest"),
    path("riskattribution", views.riskattribution, name="riskattribution"),
    path("blog/post/<str:slug>", views.post, name="post"),
    path("blog", views.blog, name="blog"),
]
