from django.test import TestCase

from helpers.sec.thirteenf import ThirteenFParser


class TestThirteenFParser(TestCase):
    def setUp(self):
        with open("./helpers/sec/__mocks__/thirteenf.xml", "r") as f:
            self.thirteenf = f.read()
        return

    def test_that_thirteenf_parser_loads(self):
        thirteenf = ThirteenFParser(self.thirteenf)
        self.assertTrue(len(thirteenf.get_positions()) != 0)
        return
