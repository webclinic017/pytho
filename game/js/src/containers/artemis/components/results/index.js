import React from "react"

import { useStockOverview } from "@Components/reducers/stockoverview";
import { LineChartWithTimeButtons } from "@Components/charts";

export const Results = (props) => {

  const {
    getOverview,
    state
  } = useStockOverview();

  const onClickFunc = (e) => {
    e.preventDefault()
    getOverview()
  }

  const {
    stockData
  } = state;

  return (
    <div>
      <button onClick={onClickFunc}>Test</button>
      { stockData && <LineChartWithTimeButtons xValues={stockData.dates} yValues={[stockData.close]} labels={['IBM']} rootId={'chart-container-stocks'} />}
    </div>
  )
}