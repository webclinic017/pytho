import os
from django.shortcuts import render
from django.http import HttpResponse
import yaml

def get_post_text(loc):
    file_path = os.path.join(os.path.dirname(__file__), 'templates/game/markdown/' + loc)
    if (os.path.exists(file_path)):
      with open(file_path) as f:
          return f.read()
    return None

def get_meta():
    meta_path = os.path.join(os.path.dirname(__file__), 'templates/game/meta/')
    paths = [i for i in os.listdir(meta_path)]
    posts = []
    for meta in paths:
        with open(meta_path + meta, 'r') as f:
            posts.append(yaml.safe_load(f.read()))
    return posts

def portfolioshare(request):
    return render(request, 'game/portfolioshare.html')

def fortyannual(request):
    return render(request, 'game/fortyannual.html')

def index(request):
    return render(request, 'game/index.html')

def blog(request):
    posts_meta = get_meta()
    context={"posts_meta": posts_meta}
    return render(request, 'game/blog.html', context)

def post(request, slug):

    posts_meta = get_meta()
    post_text = None
    post_meta = None
    for meta in posts_meta:
        if meta['slug'] == slug:
            post_meta = meta
            post_text = get_post_text(meta['location'])
        
    if not post_text:
        return HttpResponse("Miss")
    context = {"text": post_text, "meta": post_meta}
    return render(request, 'game/post.html', context)

def explain(request):
    file_path = os.path.join(os.path.dirname(__file__), 'templates/game/markdown/explain.md')
    with open(file_path) as f:
        explainertext = f.read()
    context = {"explainertext": explainertext}
    return render(request, 'game/explain.html', context)
