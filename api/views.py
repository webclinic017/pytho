from typing import Dict, List, Any, Optional
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import json

from api.models import Coverage
from helpers import sample, chart, analysis, prices
from helpers.analysis.drawdown import HistoricalDrawdownEstimatorResult
from helpers.analysis.riskattribution import (
    BootstrapRiskAttributionResult,
    RiskAttributionResult,
    RollingRiskAttributionResult,
)
from helpers.prices.data import DataSource
from api.decorators import (  # type: ignore
    regression_input_parse,
    RegressionInput,
    RollingRegressionInput,
)
from helpers.sample.sample import Sample
from helpers.backtest import (
    StaticPortfolioBackTest,
    FixedSignalBackTestWithPriceAPI,
    BackTestUnusableInputException,
    BackTestInvalidInputException,
)


@csrf_exempt  # type: ignore
@require_POST  # type: ignore
def backtest_portfolio(request: HttpRequest) -> JsonResponse:
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
    req_body: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
    if "data" not in req_body:
        return JsonResponse(
            {"status": "false", "message": "Client passed no data to run backtest on"},
            status=400,
        )

    bt_portfolio: Dict[str, List[Any]] = req_body["data"]
    resp: Dict[str, Dict[str, Any]] = {}
    resp["data"] = {}

    assets: List[int] = bt_portfolio["assets"]
    weights: List[float] = bt_portfolio["weights"]

    try:
        bt: FixedSignalBackTestWithPriceAPI = FixedSignalBackTestWithPriceAPI(
            assets, weights
        )
        bt.run()
    except BackTestInvalidInputException:
        return JsonResponse(
            {"status": "false", "message": "Inputs are invalid"}, status=404
        )
    except BackTestUnusableInputException:
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
        resp["data"] = bt.results
        return JsonResponse(resp, status=200)


@regression_input_parse(has_window=True)  # type: ignore
@require_GET  # type: ignore
def bootstrap_risk_attribution(
    request: HttpRequest, regression: RollingRegressionInput, coverage: List[Coverage]
) -> JsonResponse:
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

    dep = regression["dep"]
    ind = regression["ind"]
    window = regression["window"]

    req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage)
    model_prices: Dict[int, DataSource] = req.get()

    try:
        ra: analysis.BootstrapRiskAttribution = analysis.BootstrapRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=window,
        )
        res: BootstrapRiskAttributionResult = ra.run()
        return JsonResponse(res, safe=False)
    except analysis.RiskAttributionUnusableInputException as e:
        return JsonResponse({"status": "false", "message": str(e.message)}, status=404)
    except analysis.WindowLengthError:
        return JsonResponse(
            {"status": "false", "message": "Window length invalid"}, status=400
        )
    except ConnectionError:
        return JsonResponse(
            {
                "status": "false",
                "message": "Couldn't complete request due to connection error",
            },
            status=503,
        )


@regression_input_parse(has_window=True)  # type: ignore
@require_GET  # type: ignore
def rolling_risk_attribution(
    request: HttpRequest, regression: RollingRegressionInput, coverage: List[Coverage]
) -> JsonResponse:
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
    dep = regression["dep"]
    ind = regression["ind"]
    window = regression["window"]

    req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage)
    model_prices: Dict[int, DataSource] = req.get()

    try:
        ra: analysis.RollingRiskAttribution = analysis.RollingRiskAttribution(
            dep=dep,
            ind=ind,
            data=model_prices,
            window_length=window,
        )
        res: RollingRiskAttributionResult = ra.run()
        return JsonResponse(res, safe=False)
    except analysis.RiskAttributionUnusableInputException as e:
        return JsonResponse({"status": "false", "message": str(e.message)}, status=404)
    except analysis.WindowLengthError:
        return JsonResponse(
            {"status": "false", "message": "Window length invalid"}, status=400
        )
    except ConnectionError:
        return JsonResponse(
            {
                "status": "false",
                "message": "Couldn't complete request due to connection error",
            },
            status=503,
        )


@regression_input_parse(has_window=False)  # type: ignore
@require_GET  # type: ignore
def hypothetical_drawdown_simulation(
    request: HttpRequest, regression: RollingRegressionInput, coverage: List[Coverage]
) -> JsonResponse:
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
    ind = regression["ind"]
    dep = regression["dep"]

    req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage)
    model_prices: Dict[int, DataSource] = req.get()

    try:
        hde: analysis.HistoricalDrawdownEstimatorFromDataSources = (
            analysis.HistoricalDrawdownEstimatorFromDataSources(
                ind=ind, dep=dep, model_prices=model_prices, threshold=-0.1
            )
        )
        res: HistoricalDrawdownEstimatorResult = hde.get_results()
        return JsonResponse(res)
    except analysis.RiskAttributionUnusableInputException as e:
        return JsonResponse({"status": "false", "message": str(e.message)}, status=404)
    except analysis.HistoricalDrawdownEstimatorNoFactorSourceException:
        return JsonResponse(
            {"status": "false", "message": "Independent variables must be factor"},
            status=400,
        )
    except ConnectionError:
        return JsonResponse(
            {
                "status": "false",
                "message": "Couldn't complete request due to connection error",
            },
            status=503,
        )


@regression_input_parse(has_window=False)  # type: ignore
@require_GET  # type: ignore
def risk_attribution(
    request: HttpRequest, regression: RegressionInput, coverage: List[Coverage]
) -> JsonResponse:
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
    ind = regression["ind"]
    dep = regression["dep"]

    try:
        req: prices.PriceAPIRequests = prices.PriceAPIRequests(coverage)
        model_prices: Dict[int, DataSource] = req.get()

        ra: analysis.RiskAttribution = analysis.RiskAttribution(
            dep=dep, ind=ind, data=model_prices
        )
        res: RiskAttributionResult = ra.run()
        return JsonResponse(res)
    except analysis.RiskAttributionUnusableInputException as e:
        return JsonResponse({"status": "false", "message": str(e.message)}, status=404)
    except ConnectionError:
        return JsonResponse(
            {
                "status": "false",
                "message": "Couldn't complete request due to connection error",
            },
            status=503,
        )


@csrf_exempt  # type: ignore
@require_POST  # type: ignore
def portfolio_simulator(request: HttpRequest) -> JsonResponse:

    """Simulator is idempotent, all the state regarding
    the current position of the simulation is held on the
    client. All we do on the server is create a portfolio
    with the weights and returns, and calcuate the perf
    statistics.

    Parameters
    --------


    Returns
    --------
    200
      Simulator runs one iteration
    400
      Client passes an input that is invalid
    404
      Client passes a valid input but these can't be used to run a backtest
    405
      Client attempts a method other than POST
    503
      Couldn't connect to downstream API

    """
    body: Dict[str, Any] = json.loads(request.body.decode("utf-8"))

    sim_data: Optional[List[Sample]] = body.get("sim_data", None)
    sim_position: Optional[int] = body.get("sim_position", None)
    weights: Optional[List[List[float]]] = body.get("weights", None)
    start_val: Optional[int] = body.get("startval", None)
    sixty_forty_weights: List[float] = [0.3, 0.3, 0.2, 0.2]

    if not sim_position:
        return JsonResponse(
            {"status": "false", "message": "Missing simulation position"}, status=400
        )

    if not sim_data and sim_position == 1:
        ##First iteration
        sim_data = sample.SampleByCountryYear.get_countries()

    if sim_position != 1 and not sim_data:
        return JsonResponse(
            {"status": "false", "message": "Missing simulation settings"}, status=400
        )

    if not weights:
        return JsonResponse(
            {"status": "false", "message": "Missing weights"}, status=400
        )
    else:
        is_right_len: bool = len(weights) == sim_position
        if not is_right_len:
            return JsonResponse(
                {"status": "false", "message": "Weights malformed"}, status=400
            )

    if sim_data:
        ##If we get to this point, we always have sim_data
        sample_data: List[List[float]] = sample.SampleByCountryYear(sim_data).build()

        static_bt = StaticPortfolioBackTest(weights, sample_data[:sim_position])
        static_bt.run()
        benchmark_bt = StaticPortfolioBackTest(
            sixty_forty_weights, sample_data[:sim_position]
        )
        benchmark_bt.run()

    resp: Dict[str, Any] = {}
    resp["simportfolio"] = static_bt.results
    resp["benchmarkportfolio"] = benchmark_bt.results
    resp["sim_data"] = sim_data
    return JsonResponse(resp, status=200)


@require_GET  # type: ignore
def price_coverage_suggest(request: HttpRequest) -> JsonResponse:
    security_type: str = request.GET.get("security_type", None)
    if not security_type:
        raise JsonResponse(
            {"status": "false", "message": "security_type is required parameter"},
            status=400,
        )

    suggest_str: str = request.GET.get("s", None).lower()
    if not suggest_str:
        raise JsonResponse(
            {"status": "false", "message": "s is required parameter"}, status=400
        )

    if len(suggest_str) < 2:
        ##We return empty whenever string isn't long enough to return good results
        return JsonResponse({"coverage": []}, status=200)

    return JsonResponse(
        {
            "coverage": list(
                Coverage.objects.filter(
                    security_type=security_type,
                    name__icontains=suggest_str,
                ).values()
            )
        },
        status=200,
    )


@csrf_exempt  # type: ignore
def chartshare(request: HttpRequest) -> JsonResponse:
    chart_writer = chart.ChartWriterFromRequest(request)  # type: ignore
    file_name = chart_writer.write_chart()
    return JsonResponse({"link": file_name})
