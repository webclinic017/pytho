from typing import Dict, List
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from api.models import Coverage
from helpers import sample, chart, analysis, prices, portfolio, backtest
from helpers.analysis.drawdown import HistoricalDrawdownEstimatorResults
from helpers.analysis.riskattribution import (
    BootstrapRiskAttributionResult,
    RiskAttributionResult,
    RollingRiskAttributionResult,
)
from helpers.prices.data import DataSource


@csrf_exempt
def backtest_portfolio(request):
    """
    Parameters
    --------
    data : `Dict[assets : List[int], weights : List[float]]`
      Assets and weights to run static benchmark against

    Returns
    --------
    200
      Backtest runs successfully and returns performance numbers
    400
      Client passes an input that is does not have any required parameters
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than POST
    503
      Couldn't connect to downstream API
    """
    if not request.method == "POST":
        return JsonResponse({}, status=405)

    req_body: str = json.loads(request.body.decode("utf-8"))
    if "data" not in req_body:
        return JsonResponse(
            {"status": "false", "message": "Client passed no data to run backtest on"},
            status=400,
        )

    bt_portfolio: Dict = req_body["data"]
    resp = {}
    resp["data"] = {}

    assets: List[int] = bt_portfolio["assets"]
    weights: List[float] = bt_portfolio["weights"]

    try:
        bt: backtest.FixedSignalBackTestWithPriceAPI = (
            backtest.FixedSignalBackTestWithPriceAPI(assets, weights)
        )
        bt.run()
    except backtest.BackTestInvalidInputException:
        return JsonResponse(
            {"status": "false", "message": "Inputs are invalid"}, status=404
        )
    except backtest.BackTestUnusableInputException:
        return JsonResponse(
            {"status": "false", "message": "Backtest could not run with inputs"},
            status=404,
        )
    except ConnectionError:
        return JsonResponse(
            {
                "status": "false",
                "message": "Couldn't complete request due to connection error",
            },
            status=503,
        )
    else:
        resp["data"]["returns"] = bt.results["returns"]
        resp["data"]["cagr"] = bt.results["cagr"]
        resp["data"]["vol"] = bt.results["annualised_vol"]
        resp["data"]["maxdd"] = bt.results["max_drawdown"]
        resp["data"]["cumReturns"] = bt.results["cum_returns"]
        resp["data"]["equityCurve"] = bt.results["equity_curve"]
        resp["data"]["returnsQuantiles"] = bt.results["returns_quantiles"]
        return JsonResponse(resp, status=200)


def bootstrap_risk_attribution(request):
    """
    Parameters
    --------
    ind : `List[int]`
      List of independent variable asset ids for regression
    dep : int
      Asset id for dependent variable in regression
    window : int
      Size of the rolling window

    Returns
    --------
    200
      Risk attribution runs and returns estimate
    400
      Client passes an input that is does not have any required parameters
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than GET
    503
      Couldn't connect to downstream API
    """
    if not request.method == "GET":
        return JsonResponse({}, status=405)

    ind: List[int] = request.GET.getlist("ind", None)
    dep: int = request.GET.get("dep", None)
    window: int = request.GET.get("window", 90)

    if not ind or not dep:
        return JsonResponse(
            {
                "status": "false",
                "message": "Must pass at least one independent and only one dependent to risk attribution",
            },
            status=400,
        )

    if isinstance(window, str) and not window.isdigit():
        return JsonResponse(
            {"status": "false", "message": "Must pass a number to window"}, status=400
        )
    else:
        window = int(window)

    coverage: List[int] = [dep, *ind]
    try:
        coverage_obj_result: List[Coverage] = Coverage.objects.filter(id__in=coverage)
    except Exception:
        return JsonResponse(
            {"status": "false", "message": "Invalid asset ids"}, status=400
        )
    else:
        """If we do not have coverage for at least one asset id passed by client
        then we need to exit the analysis with error. This will also fail with
        non-unique asset ids
        """
        if not coverage_obj_result or len(coverage_obj_result) != len(coverage):
            return JsonResponse(
                {"status": "false", "message": "Invalid or missing asset ids"},
                status=404,
            )

        req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage_obj_result)
        model_prices: Dict[int, DataSource] = req.get()

        ra: analysis.BootstrapRiskAttribution = analysis.BootstrapRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=window,
        )
        res: BootstrapRiskAttributionResult = ra.run()
        return JsonResponse(res, safe=False)


def rolling_risk_attribution(request):
    """
    Parameters
    --------
    ind : `List[int]`
      List of independent variable asset ids for regression
    dep : int
      Asset id for dependent variable in regression

    Returns
    --------
    200
      Risk attribution runs and returns estimate
    400
      Client passes an input that is does not have any required parameters
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than GET
    503
      Couldn't connect to downstream API
    """
 
    if not request.method == "GET":
        return JsonResponse({}, status=405)

    ind: List[int] = request.GET.getlist("ind", None)
    dep: int = request.GET.get("dep", None)

    coverage: List[int] = [dep, *ind]
    try:
        coverage_obj_result = Coverage.objects.filter(id__in=coverage)
    except Exception:
        return JsonResponse(
            {"status": "false", "message": "Invalid asset ids"}, status=400
        )
    else:
        if not coverage_obj_result or len(coverage_obj_result) != len(coverage):
            return JsonResponse(
                {"status": "false", "message": "Invalid or missing asset ids"},
                status=404,
            )
        req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage_obj_result)
        model_prices: Dict[int, DataSource] = req.get()

        ra: analysis.RollingRiskAttribution = analysis.RollingRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=90,
        )
        res: RollingRiskAttributionResult = ra.run()
        return JsonResponse(res, safe=False)


def hypothetical_drawdown_simulation(request):
    """
    Parameters
    --------
    ind : `List[int]`
      List of independent variable asset ids for regression
    dep : int
      Asset id for dependent variable in regression

    Returns
    --------
    200
      Risk attribution runs and returns estimate
    400
      Client passes an input that is does not have any required parameters
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than GET
    503
      Couldn't connect to downstream API
    """

    if not request.method == "GET":
        return JsonResponse({}, status=405)

    ind: List[int] = request.GET.getlist("ind", None)
    dep: int = request.GET.get("dep", None)

    coverage: List[int] = [dep, *ind]
    try:
        coverage_obj_result = Coverage.objects.filter(id__in=coverage)
    except Exception:
        return JsonResponse(
            {"status": "false", "message": "Invalid asset ids"}, status=400
        )
    else:
        if not coverage_obj_result or len(coverage_obj_result) != len(coverage):
            return JsonResponse(
                {"status": "false", "message": "Invalid or missing asset ids"},
                status=404,
            )
        req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage_obj_result)
        model_prices: Dict[int, DataSource] = req.get()

        hde: analysis.HistoricalDrawdownEstimatorFromDataSources = analysis.HistoricalDrawdownEstimatorFromDataSources(
            model_prices=model_prices,
            threshold=-0.1
        )
        res: HistoricalDrawdownEstimatorResults = hde.get_results()
        return JsonResponse(res)


def risk_attribution(request):
    """
    Parameters
    --------
    ind : `List[int]`
      List of independent variable asset ids for regression
    dep : int
      Asset id for dependent variable in regression

    Returns
    --------
    200
      Risk attribution runs and returns estimate
    400
      Client passes an input that is does not have any required parameters
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than GET
    503
      Couldn't connect to downstream API
    """
    if not request.method == "GET":
        return JsonResponse({}, status=405)

    ind: List[int] = request.GET.getlist("ind", None)
    dep: int = request.GET.get("dep", None)

    coverage: List[int] = [dep, *ind]
    try:
        coverage_obj_result = Coverage.objects.filter(id__in=coverage)
    except Exception:
        return JsonResponse(
            {"status": "false", "message": "Invalid asset ids"}, status=400
        )
    else:
        if not coverage_obj_result or len(coverage_obj_result) != len(coverage):
            return JsonResponse(
                {"status": "false", "message": "Invalid or missing asset ids"},
                status=404,
            )
        req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage_obj_result)
        model_prices: Dict[int, DataSource] = req.get()

        ra: analysis.RiskAttribution = analysis.RiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices
        )
        res: RiskAttributionResult = ra.run()
        return JsonResponse(res)

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
    simportfolio = portfolio.PortfolioWithMoney(weights, sample_data[:sim_position])
    benchmarkportfolio = portfolio.PortfolioWithConstantWeightsAndMoney(
        sixty_forty_weights, sample_data[:sim_position]
    )

    resp = {}
    resp["simportfolio"] = portfolio.ParsePerfAndValuesFromPortfolio.to_json(
        simportfolio
    )
    resp["benchmarkportfolio"] = portfolio.ParsePerfAndValuesFromPortfolio.to_json(
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
                    Coverage.objects.filter(security_type=security_type).values()
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
