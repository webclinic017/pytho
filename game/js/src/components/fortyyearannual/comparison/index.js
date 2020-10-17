import React from "react"

import { usePortfolio } from '@Components/reducers/portfolio'

import { Text } from '@Common'

/*
           real
count 10000.000
mean   1195.551
std    1377.029
min      38.570
25%     511.660
50%     835.849
75%    1372.775
max   40154.308
*/

export const Comparison = props => {

  const { state } = usePortfolio()
  const {
    portfolio,
    isFinished
  } = state

  const value = portfolio 
    ? portfolio.getValue()
    : -1

  if (value != -1 && isFinished) {
    let str = ''
    if (value < 511) str = 'Below 25th percentile'
    else if (value < 835) str = '25-50th percentile'
    else if (value < 1372) str = '50-75th percentile'
    else str = 'Above 75th percentile'
    return <Text>{str} versus 10k simulations of 60/60 allocation</Text>
  } else {
    return null
  }
}
