from unittest.mock import patch
from django.test import SimpleTestCase
from django.conf import settings

from ..chart import ChartWriterFromDataUrl


class TestImageParsing(SimpleTestCase):
    def setUp(self):
        path_from_base = "/api/helpers/chart/dataurlsample"
        with open(settings.BASE_DIR + path_from_base, "r") as f:
            self.image_data_url = f.read()
        return

    def test_that_image_is_converted_successfully(self):
        chart_obj = ChartWriterFromDataUrl(self.image_data_url)
        self.assertEqual(type(chart_obj.image_binary), bytes)
        return

    def test_that_image_is_written_to_disk(self):
        with patch(
            "api.helpers.chart.chart.StaticImagesLocation"
        ) as MockClass:
            instance = MockClass.return_value
            instance.write.return_value = "foo"

            chart_obj = ChartWriterFromDataUrl(self.image_data_url)
            chart_obj.write_chart()
            instance.write.asset_called()
        return

    def test_that_write_chart_returns_filename_string(self):
        with patch(
            "api.helpers.chart.chart.StaticImagesLocation"
        ) as MockClass:
            instance = MockClass.return_value
            instance.write.return_value = "foo"

            chart_obj = ChartWriterFromDataUrl(self.image_data_url)
            val = chart_obj.write_chart()

            ##This is making sure that the file_name created is returned
            ##to the client, we don't care what the algorithm for creation
            ##is, only that we return the result to the client

            file_name = instance.write.call_args_list[0][0][0]
            self.assertEqual(file_name, val)
