import React from "react"

import { RenderIf } from './common.js'

const RowCountry = ({isFinished, periods}) => {
  const splitcountry = p => p.split("-")[0]
  return (
    <RenderIf cond={isFinished}>
      <tr>
        <td>Country</td>
        <td></td>
        <td></td>
        { periods.map((v,i) => <td key={i}>{splitcountry(v)}</td> ) }
      </tr>
    </RenderIf>
  )
}

const RowYear = ({isFinished, periods}) => {
  const splityear = p => p.split("-").slice(1).join("-")
  return (
    <RenderIf cond={isFinished}>
      <tr>
        <td>Years</td>
        <td></td>
        <td></td>
        { periods.map((v, i) => <td key={i}>{splityear(v)}</td> ) }
      </tr>
    </RenderIf>
  )
}

const RowStat = ({perfObj, benchObj, stat}) => {
  const {portfolioPerf, assetsPerf} = perfObj
  const {portfolioPerf: benchPerf} = benchObj
  const strConverter = scalar => (scalar*100).toPrecision(2) + "%"
  return (
    <tr>
      <td>{stat}</td>
      <td>{strConverter(portfolioPerf[stat])}</td>
      <td>{strConverter(benchPerf[stat])}</td>
      {assetsPerf.map((v, i) => <td key={i}>{strConverter(v[stat])}</td>)}
    </tr>
  )
}


export const PortfolioPerformance = ({portfolio, isFinished, periods, benchmark}) => {

   if (portfolio && portfolio.period.getPeriod() > 1) {

     const perfObj = portfolio.getPerformance()
     const benchObj = benchmark.getPerformance()
     
     const stats = ['CAGR','Vol','MDD']

     return (
       <table id="portfolio-perf-table" style={{textAlign: 'right'}}>
         <thead>
          <tr>
            <th>Stat</th>
            <th>Your Perf</th>
            <th>60/40</th>
            <th>Equity 1</th>
            <th>Equity 2</th>
            <th>Bond 1</th> 
            <th>Bond 2</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s,i) => <RowStat key={i} perfObj={perfObj} benchObj={benchObj} stat={s} />)}
          <RowCountry isFinished={isFinished} periods={periods} />
          <RowYear isFinished={isFinished} periods={periods} />
        </tbody>
      </table>
     )
   } else {
     return <div />
   }
}
