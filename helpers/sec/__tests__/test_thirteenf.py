from django.test import TestCase
from api.models import SecFilingPaths
from unittest.mock import Mock, patch

from helpers.sec.thirteenf import ThirteenFParser, ThirteenFFetcher


class TestThirteenFParser(TestCase):
    def setUp(self):
        with open("./helpers/sec/__mocks__/thirteenf.xml", "r") as f:
            self.thirteenf = f.read()
        return

    def test_that_thirteenf_parser_loads(self):
        thirteenf = ThirteenFParser(self.thirteenf)
        self.assertTrue(len(thirteenf.get_positions()) != 0)
        return


class TestThirteenFFetcher(TestCase):
    def setUp(self):
        with open("./helpers/sec/__mocks__/thirteenf.xml", "r") as f:
            self.thirteenf = f.read()
        return

    @patch("helpers.sec.thirteenf.requests.Session")
    def test_that_thirteenf_fetcher_loads(self, mock_request):
        filing_path = SecFilingPaths(
            issuer_id=1, form_id=1, date=1, path="0001567619-21-015518"
        )

        mockRequestSession = Mock()
        mockRequestSession.get.return_value.text = self.thirteenf

        mock_request.return_value = mockRequestSession
        fetcher = ThirteenFFetcher(filing_path)
        self.assertTrue(fetcher.data)
