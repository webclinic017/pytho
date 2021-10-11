import json
import random
import string
from base64 import decodebytes

from .staticimageslocation import StaticImagesLocation


def _convert_data_url_to_binary(data_url_string):
    image_str = data_url_string[26:].strip()
    return decodebytes(image_str.encode())


def _get_random_string(n):
    return "".join(
        random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits)
        for _ in range(n)
    )


class ChartWriterFromDataUrl:
    def write_chart(self):
        random_string = _get_random_string(20)
        static = StaticImagesLocation()
        static.write(random_string, self.image_binary, ".svg")
        return random_string

    def __init__(self, data_url):
        self.image_binary = _convert_data_url_to_binary(data_url)
        return


class ChartWriterFromRequest:
    def write_chart(self):
        return self.chart.write_chart()

    def __init__(self, request):
        req_data_body = json.loads(request.body.decode("utf-8"))["data"]
        self.chart = ChartWriterFromDataUrl(req_data_body)
        return
