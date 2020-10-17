import React from "react"

import { usePortfolio } from '@Components/reducers/portfolio'
import { 
  Panel,
} from '@Common'

import { PerfRow } from './components/perfrow'

export const PortfolioPerformance = props => {

   const { state } = usePortfolio()
   const {
     portfolio,
     benchmark,
     periods,
     isFinished
   } = state

   if (portfolio && portfolio.period.getPeriod() > 0) {

     const perfObj = portfolio.getPerformance()
     const benchObj = benchmark.getPerformance()
     
     const stats = ['CAGR','Vol','MDD']
     const assetTitles = [
       'Equity 1',
       'Equity 2',
       'Bond 1',
       'Bond 2'
     ]

     return (
       <Panel>
        <PerfRow
          first
          data={perfObj['portfolioPerf']}
          title={'Your Performance'} />
        <PerfRow
          data={benchObj['portfolioPerf']}
          title={'60/40 Performance'} />
        {perfObj['assetsPerf'].map((d, i) => (
          <PerfRow
            key={i}
            data={d}
            period={isFinished && periods[i]}
            title={assetTitles[i]} />
        ))}
      </Panel>
     )
   } else {
     return <div />
   }
}
