from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Manager
from django.db import connection
import json

from api.models import RealReturns, Coverage
from helpers import sample, chart, analysis, prices, portfolio, backtest


@csrf_exempt
def backtest_portfolio(request):
    bt_portfolio = json.loads(request.body.decode("utf-8"))["data"]
    resp = {}
    resp["data"] = {}

    if bt_portfolio:
        assets = bt_portfolio["assets"]
        weights = bt_portfolio["weights"]

        bt = backtest.FixedSignalBackTestWithPriceAPI(assets, weights)
        bt.run()
        resp["data"]["returns"] = bt.results["returns"]
        resp["data"]["cagr"] = bt.results["cagr"]
        resp["data"]["vol"] = bt.results["annualised_vol"]
        resp["data"]["maxdd"] = bt.results["max_drawdown"]
        resp["data"]["cumReturns"] = bt.results["cum_returns"]
        resp["data"]["equityCurve"] = bt.results["equity_curve"]
        resp["data"]["returnsQuantiles"] = bt.results["returns_quantiles"]
        return JsonResponse(resp)
    return JsonResponse(resp)


def bootstrap_risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get()

        ra = analysis.BootstrapRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=90,
        )
        res = ra.run().get_results()
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
        model_prices = req.get()

        ra = analysis.RollingRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=90,
        )
        res = ra.run().get_results()
        return JsonResponse(res, safe=False)

    else:
        return JsonResponse({})


def hypothetical_drawdown_simulation(request):

    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get()
        hde = analysis.HistoricalDrawdownEstimatorFromDataSources(
            model_prices, -0.2
        )
        return JsonResponse(hde.get_results())
    else:
        return JsonResponse({})


def risk_attribution(request):
    ind = request.GET.getlist("ind", None)
    dep = request.GET.get("dep", None)

    coverage = [dep, *ind]
    coverage_obj_result = Coverage.objects.filter(id__in=coverage)

    if coverage_obj_result and len(coverage_obj_result) > 0:
        req = prices.PriceAPIRequests(coverage_obj_result)
        model_prices = req.get()

        ra = analysis.RiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
        )
        res = ra.run().get_results()
        return JsonResponse(res)
    else:
        return JsonResponse({})


@csrf_exempt
def portfolio_simulator(request):

    """Simulator is idempotent, all the state regarding
    the current position of the simulation is held on the
    client. All we do on the server is create a portfolio
    with the weights and returns, and calcuate the perf
    statistics.
    """
    body = json.loads(request.body.decode("utf-8"))

    sim_data = body.get("sim_data", None)
    sim_position = body.get("sim_position", None)
    weights = body.get("weights", None)
    start_val = body.get("startval", None)
    sixty_forty_weights = [0.3, 0.3, 0.2, 0.2]

    if not sim_data:
        sim_position = 1
        sim_data = sample.SampleByCountryYear.get_countries()

    sample_data = sample.SampleByCountryYear(*sim_data).build()
    simportfolio = portfolio.PortfolioWithMoney(
        weights, sample_data[:sim_position]
    )
    benchmarkportfolio = portfolio.PortfolioWithConstantWeightsAndMoney(
        sixty_forty_weights, sample_data[:sim_position]
    )

    resp = {}
    resp[
        "simportfolio"
    ] = portfolio.ParsePerfAndValuesFromPortfolio.to_json(simportfolio)
    resp[
        "benchmarkportfolio"
    ] = portfolio.ParsePerfAndValuesFromPortfolio.to_json(
        benchmarkportfolio
    )
    resp["sim_data"] = sim_data
    return JsonResponse(resp)


def price_history(request):
    requested_security = request.GET.get("security_id", None)

    coverage_obj_result = Coverage.objects.filter(id=requested_security)
    if coverage_obj_result and len(coverage_obj_result) > 0:
        coverage_obj = coverage_obj_result.first()
        price_request = prices.PriceAPIRequest(coverage_obj)
        prices_dict = price_request.get()
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


@csrf_exempt
def chartshare(request):
    chart_writer = chart.ChartWriterFromRequest(request)
    file_name = chart_writer.write_chart()
    return JsonResponse({"link": file_name})
