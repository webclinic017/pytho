from django.test import SimpleTestCase

from ..portfolio import (
    Portfolio,
    PortfolioWithReturns,
    PortfolioWithConstantWeights,
    MisshapedReturnsException,
    HistoricalPortfolioConstantWeightsPriceAPI,
    PortfolioWithMoney,
    RealTimePortfolio,
)


class TestPortfolioWithConstantWeights(SimpleTestCase):
    def test_that_it_can_be_created(self):
        rets = [[20.0, 20.0], [10.0, 10.0]]
        weights = [0.9, 0.1]
        self.port = PortfolioWithConstantWeights(weights, rets)
        return


class TestHistoricalPortfolioConstantWeightsPriceAPI(SimpleTestCase):
    def setUp(self):
        self.port = HistoricalPortfolioConstantWeightsPriceAPI(
            [1], {666: {"daily_rt": {"123": 5.0, "124": -5.0}}}
        )
        return

    def test_that_performance_exists(self):
        cagr = self.port.get_portfolio_cagr()
        return


class TestRealTimePortfolio(SimpleTestCase):
    def setUp(self):
        self.port = RealTimePortfolio()

    def test_that_steps_forward(self):
        weights = [0.1, 0.9]
        rets = [20.0, 20.0]
        self.port.step_forward(weights, rets)
        rets_1 = [10.0, 10.0]
        self.port.step_forward(weights, rets_1)
        rets_2 = [-20.0, -30.0]
        self.port.step_forward(weights, rets_2)
        rets_3 = [1.0, -5.0]
        self.port.step_forward(weights, rets_3)

        self.assertTrue(self.port.period == 4)
        self.assertTrue(len(self.port.weights) == 4)
        self.assertTrue(len(self.port.returns) == 4)
        return


class TestPortfolioWithReturns(SimpleTestCase):
    def setUp(self):
        self.rets = [[20.0, 20.0], [10.0, 10.0]]
        self.weights = [[0.1, 0.9], [0.9, 0.1]]
        self.port = PortfolioWithReturns(self.weights, self.rets)
        return

    def test_throws_error_when_returns_are_misshaped(self):

        rets_too_short = [[20.0]]
        p1 = PortfolioWithReturns(self.weights, rets_too_short)
        with self.assertRaises(MisshapedReturnsException):
            p1.get_portfolio_returns()

        rets_too_long = [[20.0, 20.0], [20.0, 20.0], [20.0, 20.0]]
        p2 = PortfolioWithReturns(self.weights, rets_too_long)
        with self.assertRaises(MisshapedReturnsException):
            p2.get_portfolio_returns()
        return

    def test_that_returns_are_returned(self):
        rets = self.port.get_portfolio_returns()
        expected = [20.0, 10.0]
        self.assertEqual(expected, rets)
        return

    def test_that_maxdd_calculates(self):
        maxdd = self.port.get_portfolio_maxdd()
        expected = 0
        self.assertEquals(expected, maxdd)

        rets = [[20.0, 20.0], [-10.0, -50.0], [10.0, -10.0]]
        weights = [[0.4, 0.6], [0.3, 0.7], [0.6, 0.4]]
        port = PortfolioWithReturns(weights, rets)
        maxdd_2 = port.get_portfolio_maxdd()
        expected_2 = -38.0
        self.assertEquals(expected_2, maxdd_2)
        return

    def test_that_maxdd_threshold_position_calculates(self):
        """
        maxdd = self.port.get_portfolio_maxdd_threshold_position(-0.2)
        expected = {}
        self.assertEquals(expected, maxdd)
        """

        rets = [
            [20.0, 20.0],
            [-10.0, -50.0],
            [10.0, -10.0],
            [60.0, 60.0],
            [-50.0, -50.0],
            [10.0, 10.0],
            [10.0, 10.0],
            [100.0, 100.0],
        ]
        weights = [
            [0.4, 0.6],
            [0.3, 0.7],
            [0.6, 0.4],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
            [0.5, 0.5],
        ]
        port = PortfolioWithReturns(weights, rets)
        maxdd_2 = port.get_portfolio_maxdd_threshold_position(-0.2)
        self.assertEquals([1.0, 3.0], maxdd_2[0][:2])
        self.assertEquals([4.0, 7.0], maxdd_2[1][:2])
        return

    def test_that_volatility_calculates(self):
        vol = self.port.get_portfolio_volatility()
        expected = 5.0
        self.assertEquals(expected, vol)
        return

    def test_that_cagr_calculates(self):
        cagr = self.port.get_portfolio_cagr()
        expected = 14.891
        self.assertEquals(expected, cagr)
        return


class TestPortfolioWithMoney(SimpleTestCase):
    def setUp(self):
        self.weights = [[0.1, 0.9], [0.9, 0.1]]
        self.rets = [[20.0, 20.0], [10.0, 10.0]]
        self.port = PortfolioWithMoney(self.weights, self.rets)
        return

    def test_that_values_are_returns(self):
        vals = self.port.get_values()
        expected = [100.0, 120.0, 132.0]
        self.assertEquals(expected, vals)
        return


class TestPortfolio(SimpleTestCase):
    def setUp(self):
        self.weights = [[0.1, 0.9], [0.9, 0.1]]
        self.port = Portfolio(self.weights)
        return

    def test_that_weights_are_added(self):
        to_add = [0.1, 0.9]
        self.port.add_weights(to_add)

        res = self.weights
        res.append(to_add)

        self.assertEqual(self.port.weights, res)
        return
