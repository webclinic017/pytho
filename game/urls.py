from django.urls import path, re_path

from . import views

urlpatterns = [
    path("blog/post/<str:slug>", views.post, name="post"),
    path("blog", views.blog, name="blog"),
    re_path(r"^", views.index),
]
