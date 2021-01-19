from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path(
        "portfoliosimulator",
        views.portfoliosimulator,
        name="portfoliosimulator",
    ),
    path("portfolioshare", views.portfolioshare, name="portfolioshare"),
    path("backtest", views.backtest, name="backtest"),
    path(
        "exposureanalysis", views.exposureanalysis, name="exposureanalysis"
    ),
    path("blog/post/<str:slug>", views.post, name="post"),
    path("blog", views.blog, name="blog"),
]
