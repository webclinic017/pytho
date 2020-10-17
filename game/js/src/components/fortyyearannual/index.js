import React, { useState, useEffect } from 'react'

import { MessageProvider } from '@Components/reducers/message'
import { PortfolioProvider, usePortfolio } from '@Components/reducers/portfolio'
import { PortfolioInfo } from './portfolioinfo'
import { PortfolioPerformance } from './portfolioperf'
import { Comparison } from './comparison'
import { InputControl } from './inputcontrol'
import { ExplainFortyYear } from './explain'
import { 
  Button,
  Message,
  RenderIf
} from '@Common'

const FortyYearAnnual = props => {

  const { loadPortfolio } = usePortfolio()

  useEffect(() => {
    loadPortfolio()
  }, [])

  return (
    <div id="game-wrapper pure-g" data-testid="app">
      <MessageProvider>
        <Message className="pure-u-5-5" />
        <PortfolioInfo />
        <InputControl />
        <PortfolioPerformance />
        <Comparison />
        <ExplainFortyYear />
     </MessageProvider>
   </div>
  )

}

export const FortyYearAnnualApp = props => {
  return <PortfolioProvider><FortyYearAnnual {...props}/></PortfolioProvider>
}
