from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import RealReturns
from .helpers.sample import Sample, SampleChunk
from .helpers.sql import SQLReader
from .helpers.chart import ChartWriterFromRequest

def samplechunk(request):
    sample_query = SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample = SampleChunk(resp).build()
    return HttpResponse(json.dumps({"data": sample}))

def sample(request):
    sample_query = SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample = Sample(resp).build()
    return HttpResponse(json.dumps({"data": sample}))

@csrf_exempt
def chartshare(request):
    chart_writer = ChartWriterFromRequest(request)
    file_name = chart_writer.write_chart()
    return HttpResponse(json.dumps({"link": file_name}))
