import React from "react"

export const PortfolioCurrent = ({ portfolio, startVal }) => {

  const ifPeriod =  portfolio 
    ? portfolio.period.getPeriod() 
    : 0

  const ifPortfolioValue = portfolio 
    ? portfolio.getValue() 
    : startVal

  return (
    <div id="portfolio-current">
      <span id="portfolio-current-value" data-testid="app-portvalue">
        £{ifPortfolioValue}
      </span>
      <span id="portfolio-current-period" data-testid="app-period">
        Period: {ifPeriod}
      </span>
    </div>
  )
}

