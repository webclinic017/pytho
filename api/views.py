from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import RealReturns, Coverage
from .helpers import sample, rawsql, chart, analysis, prices, portfolio


@csrf_exempt
def backtest_portfolio(request):
    bt_portfolio = json.loads(request.body.decode("utf-8"))["data"]
    resp = {}
    resp["data"] = {}

    if bt_portfolio:
        assets = bt_portfolio["assets"]
        weights = bt_portfolio["weights"]
        coverage_obj_result = Coverage.objects.filter(id__in=assets)
        if coverage_obj_result and len(coverage_obj_result) > 0:
            req = prices.PriceAPIRequests(coverage_obj_result)
            returns = req.get_price_history()

            bt = portfolio.HistoricalPortfolioConstantWeightsPriceAPI(
                weights, returns
            )
            resp["data"]["cagr"] = bt.get_portfolio_cagr()
            resp["data"]["vol"] = bt.get_portfolio_volatility()
            resp["data"]["maxdd"] = bt.get_portfolio_maxdd()
            return JsonResponse(resp)
    return JsonResponse(resp)


def bootstrap_risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get_price_history()

        ram = analysis.RiskAttributionModel(ind, dep)
        ram._set_prices(model_prices)
        res = ram.run_bootstrap(90)
        return JsonResponse(res, safe=False)

    else:
        return JsonResponse({})


def rolling_risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get_price_history()

        ram = analysis.RiskAttributionModel(ind, dep)
        ram._set_prices(model_prices)
        res = ram.run_rolling(90)
        return JsonResponse(res, safe=False)

    else:
        return JsonResponse({})


def risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get_price_history()

        ram = analysis.RiskAttributionModel(ind, dep)
        ram._set_prices(model_prices)
        res = ram.run_core()
        return JsonResponse(res)

    else:
        return JsonResponse({})


def price_history(request):
    requested_security = request.GET.get("security_id", None)

    coverage_obj_result = Coverage.objects.filter(id=requested_security)
    if coverage_obj_result and len(coverage_obj_result) > 0:
        coverage_obj = coverage_obj_result.first()
        price_request = prices.PriceAPIRequest(coverage_obj)
        prices_dict = price_request.get_price_history()
        return JsonResponse(
            {
                "prices": prices_dict,
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
                        security_type=security_type,
                        name__icontains=suggest,
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
                    Coverage.objects.filter(
                        security_type=security_type
                    ).values()
                )
            }
        )
    else:
        return JsonResponse({"coverage": []})


def sample_long(request):
    sample_query = rawsql.SQLReader.get_sample_long_sql()
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
    sample_build = sample.Sample(resp, stats=stats).build()
    return JsonResponse({"data": sample_build})


def sample_chunk(request):
    sample_query = rawsql.SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample_build = sample.SampleChunk(resp).build()
    return JsonResponse({"data": sample_build})


def sample_main(request):
    sample_query = rawsql.SQLReader.get_sample_sql()
    resp = [i for i in RealReturns.objects.raw(sample_query)]
    sample_build = sample.Sample(resp).build()
    return JsonResponse({"data": sample_build})


@csrf_exempt
def chartshare(request):
    chart_writer = chart.ChartWriterFromRequest(request)
    file_name = chart_writer.write_chart()
    return JsonResponse({"link": file_name})
