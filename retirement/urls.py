from django.urls import path, include, re_path
from django.conf import settings
from django.contrib.staticfiles import views

urlpatterns = [
    path("api/", include("api.urls")),
    path("", include("game.urls")),
]

if settings.DEBUG:
    urlpatterns.insert(1, re_path(r"^static/(?P<path>.*)$", views.serve))
