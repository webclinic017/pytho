from functools import wraps
from typing import List, TypedDict

from django.http.request import HttpRequest
from django.http.response import JsonResponse


class RegressionInput(TypedDict):
    ind: List[int]
    dep: int


class RollingRegressionInput(TypedDict):
    ind: List[int]
    dep: int
    window: int


def regression_input_parse(has_window: bool = False):
    """
    Formats query string variables used in routes that
    need regression-type inputs. Will throw errors from
    here if these inputs are invalid.
    """

    def decorator(func):
        @wraps(func)
        def inner(request: HttpRequest, *args, **kwargs):

            if not request.method == "GET":
                return JsonResponse({}, status=405)

            ind: List[str] = request.GET.getlist("ind", None)
            dep: str = request.GET.get("dep", None)

            if not ind or not dep:
                return JsonResponse(
                    {
                        "status": "false",
                        "message": "Must pass at least one independent and only one dependent to risk attribution",
                    },
                    status=400,
                )

            dep_digit: int
            if dep.isdigit():
                dep_digit = int(dep)
            else:
                return JsonResponse(
                    {"status": "false", "message": "Dependent isn't a number"},
                    status=400,
                )

            ind_digit: List[int]
            is_ind_ints: bool = len(list(filter(lambda x: x.isdigit(), ind))) == len(
                ind
            )
            if is_ind_ints:
                ind_digit = list(map(lambda x: int(x), ind))
            else:
                return JsonResponse(
                    {
                        "status": "false",
                        "message": "Independent has at least one non-number input",
                    },
                    status=400,
                )

            if has_window:
                window_digit: int
                window: str = request.GET.get("window", "90")
                if window.isdigit():
                    window_digit = int(window)
                else:
                    return JsonResponse(
                        {"status": "false", "message": "Window must be a number"},
                        status=400,
                    )

                rolling: RollingRegressionInput = RollingRegressionInput(
                    ind=ind_digit, dep=dep_digit, window=window_digit
                )
                return func(request, regression=rolling, *args, **kwargs)

            regression = RegressionInput(ind=ind_digit, dep=dep_digit)
            return func(request, regression=regression, *args, **kwargs)

        return inner

    return decorator
