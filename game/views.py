import os
from django.shortcuts import render
from django.http import HttpResponse
import yaml

from .helpers.blog import Blog


def index(request):
    return render(request, "game/index.html")


def blog(request):
    posts_meta = Blog.get_meta()
    context = {"posts_meta": posts_meta}
    return render(request, "game/blog.html", context)


def post(request, slug):
    post_text, post_meta = Blog().get_post_by_slug(slug)
    if not post_text:
        return HttpResponse("Miss")
    context = {"text": post_text, "meta": post_meta}
    return render(request, "game/post.html", context)
