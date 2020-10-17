from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import RealReturns, Coverage
from .helpers.sample import Sample, SampleChunk
from .helpers.sql import SQLReader
from .helpers.chart import ChartWriterFromRequest
from .helpers.datasource import PriceAPIRequest
from .helpers.portfoliotools import RiskAttribution


def risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)
    prices = {}
    if coverage_obj_result and len(coverage_obj_result) > 0:
        for c in coverage_obj_result:
            price_request = PriceAPIRequest(c)
            prices[c.id] = price_request.get_price_history()

    ra = RiskAttribution(dep, ind, prices)
    return JsonResponse({"intercept": ra.intercept, "coef": ra.coef, "avgs": ra.avgs})


def price_history(request):
    requested_security = request.GET.get("security_id", None)

    coverage_obj_result = Coverage.objects.filter(id=requested_security)
    if coverage_obj_result and len(coverage_obj_result) > 0:
        coverage_obj = coverage_obj_result.first()
        price_request = PriceAPIRequest(coverage_obj)
        prices = price_request.get_price_history()
        return JsonResponse(
            {
                "prices": prices,
                "country_name": coverage_obj.country_name,
                "name": coverage_obj.name,
                "ticker": coverage_obj.ticker,
                "currency": coverage_obj.currency,
            }
        )
    return HttpResponse()


def price_coverage_suggest(request):
    security_type = request.GET.get("security_type", None)
    suggest = request.GET.get("s", None).lower()

    if len(suggest) < 2:
        return JsonResponse({"coverage": []})

    if security_type:
        return JsonResponse(
            {
                "coverage": list(
                    Coverage.objects.filter(
                        security_type=security_type, name__icontains=suggest
                    ).values()
                )
            }
        )
    else:
        return JsonResponse({"coverage": []})


def price_coverage(request):
    security_type = request.GET.get("security_type", None)
    if security_type:
        return JsonResponse(
            {
                "coverage": list(
                    Coverage.objects.filter(security_type=security_type).values()
                )
            }
        )
    else:
        return JsonResponse({"coverage": []})


def sample_long(request):
    sample_query = SQLReader.get_sample_long_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    stats = [
        "real_eq_tr",
        "real_eq_tr",
        "real_eq_tr",
        "real_eq_tr",
        "real_eq_tr",
        "real_bond_tr",
        "real_bond_tr",
        "real_bond_tr",
        "real_bond_tr",
        "real_bond_tr",
    ]
    sample = Sample(resp, stats=stats).build()
    return JsonResponse({"data": sample})


def samplechunk(request):
    sample_query = SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample = SampleChunk(resp).build()
    return JsonResponse({"data": sample})


def sample(request):
    sample_query = SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample = Sample(resp).build()
    return JsonResponse({"data": sample})


@csrf_exempt
def chartshare(request):
    chart_writer = ChartWriterFromRequest(request)
    file_name = chart_writer.write_chart()
    return JsonResponse({"link": file_name})
