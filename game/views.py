import os
from django.shortcuts import render
from django.http import HttpResponse

def fortyannual(request):
    return render(request, 'game/fortyannual.html')

def index(request):
    return render(request, 'game/index.html')

def explain(request):
    file_path = os.path.join(os.path.dirname(__file__), 'templates/game/markdown/explain.md')
    explainertext = open(file_path).read()
    context = {"explainertext": explainertext}
    return render(request, 'game/explain.html', context)
