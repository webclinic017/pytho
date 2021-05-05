class ParsePerfAndValuesFromPortfolio:
    @staticmethod
    def to_json(p):
        return {
            "values": p.get_values(),
            "returns": p.get_portfolio_returns(),
            "cagr": p.get_portfolio_cagr(),
            "volatility": p.get_portfolio_volatility(),
            "maxdd": p.get_portfolio_maxdd(),
        }
