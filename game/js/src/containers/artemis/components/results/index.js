import React, { useState } from "react"

import { useStockOverview } from "@Components/reducers/stockoverview";
import { LineChartWithTimeButtons } from "@Components/charts";
import { AlphaSearch } from "@Components/portfolio"

import { Table } from '../table'

export const Results = (props) => {

  const [shouldClear, setShouldClear] = useState(false)
  const [
    security, setSecurity,
  ] = useState('');

  const {
    getOverview,
    state
  } = useStockOverview();

  const onClickFunc = (e) => {
    e.preventDefault()
    getOverview(`${security.Code}.${security.Exchange}`)
  }

  const {
    prices,
    fundies,
    ticker
  } = state;

  console.log(prices)

  return (
    <div>
      <AlphaSearch
        runAfterClear={ () => setShouldClear(false) }
        shouldClear={ shouldClear }
        selectHook={ (s) => setSecurity(s) } />
      <button onClick={onClickFunc}>Test</button>
      { prices && <LineChartWithTimeButtons xValues={prices.dates} yValues={[prices.close]} labels={[ticker]} rootId={'chart-container-stocks'} />}
      { fundies && <Table fundamentals={fundies}/> }
    </div>
  )
}