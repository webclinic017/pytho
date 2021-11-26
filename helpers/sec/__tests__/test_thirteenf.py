from django.test import TestCase
from api.models import SecFilingPaths
from unittest.mock import Mock, patch

from helpers.sec.thirteenf import ThirteenFParser, ThirteenFFetcher


class TestThirteenFParser(TestCase):
    def setUp(self):
        with open("./helpers/sec/__mocks__/thirteenf.xml", "r") as f:
            self.thirteenf = Mock()
            self.thirteenf.data = f.read()
        return

    def test_that_thirteenf_parser_loads(self):
        thirteenf = ThirteenFParser(self.thirteenf)
        self.assertTrue(len(thirteenf.get_positions()) != 0)
        return


class TestThirteenFFetcher(TestCase):
    def setUp(self):
        with open("./helpers/sec/__mocks__/thirteenf.xml", "r") as f:
            self.thirteenf = Mock()
            self.thirteenf.text = f.read()
        with open("./helpers/sec/__mocks__/primary_doc.xml", "r") as f:
            self.primary = Mock()
            self.primary.text = f.read()
        with open("./helpers/sec/__mocks__/doc.html", "r") as f:
            self.doc = Mock()
            self.doc.text = f.read()
        return

    @patch("helpers.sec.thirteenf.requests.Session")
    def test_that_thirteenf_fetcher_loads(self, mock_request):
        filing_path = SecFilingPaths(
            issuer_id=1, form_id=1, date=1, path="0001567619-21-015518"
        )

        mockRequestSession = Mock()
        mockRequestSession.get.side_effect = [
            self.doc,
            self.primary,
            self.thirteenf
        ]
        mock_request.return_value = mockRequestSession
        fetcher = ThirteenFFetcher(filing_path, quiet=True)
        self.assertTrue(fetcher.data)
