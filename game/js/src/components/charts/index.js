import React, {
  useEffect,
  createContext,
  useContext,
} from 'react';

import {
  data
} from './data.js'
import {
  ChartContainer
} from './components/container'
import {
  LineChart as LineChartInner
} from  './components/line'

export const LineChart = (props) => {
  return (
    <ChartContainer>
      <LineChartInner
        data={data} />
    </ChartContainer>
  )
}
