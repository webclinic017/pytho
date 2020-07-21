/* Arbitrary asset that wraps around returns and performance numbers
   for a given list of returns.

   Can be used for components of portfolio or portfolio itself. This
   means it is can be initialised and updated 
     * Returns
     * Updates through time
     * Wraps performance object offering perf stats

   Intially, this had a concept of time and would track the portfolio
   period. This probably makes no sense and it is easier to just
   inject this into any call for returns. The object simply wraps
   around common functionality (such as perf) for assets.
*/

import {
  calculateCAGR,
  calculateVol,
  calculateMaxDD
} from './performance.js'

const perfCalc = returns => {
  return {
    "CAGR": calculateCAGR(returns),
    "Vol": calculateVol(returns),
    "MDD": calculateMaxDD(returns)
  }
}

const withNominalPerformance = state => {

  const getHistoricalReturns = () => state.getReturns().slice(0, state.periodObj.getPeriod())

  return {
    getPerformance: () => perfCalc(getHistoricalReturns())
  }
}


const asset = (returns = [], periodObj) => {

  let state = {
    returns: [...returns],
    periodObj
  }
  state.getReturns = () => state.returns,
  state.addReturn = newReturn => state.returns.push(newReturn)
  state.getReturn = () => state.returns[state.periodObj.getPeriod()]

  return Object.assign(
    state, 
    withNominalPerformance(state)
  )
}

export default asset
