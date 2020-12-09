/* Representation of a portfolio:
   * Has a value at a specific time
   * Has an allocation to assets
   * Will update over time
   * Asset allocation can change over time

   Has a length that is number of possible assets.
   This must be equal to length of returns.

   TO DO:
     * Can be reset by client
     * Will sweep empty weight into cash earning stir
*/

import asset from './asset.js';
import period from './period.js';

const withWeights = (state) => {
  const weights = new Array(state.assets.length);
  weights.fill(0);

  const isWeightUpdateValid = (assetPosition, newWeight) => {
    // We need to split validation into:
    // * We don't know what the input is at all
    // * We know the input type is correct but not
    //   whether the value is valid

    if (typeof newWeight === 'undefined') return false;
    if (isNaN(newWeight)) return false;

    // We think the type is correct

    if (newWeight < 0) return false;
    if (newWeight > 100) return false;

    const testWeights = [
      ...weights,
    ];
    testWeights[assetPosition] = newWeight/100;
    const newWeightsSum = testWeights.reduce((acc, curr) => acc+curr, 0);
    if (newWeightsSum > 1) return false;
    return true;
  };

  return {
    tryUpdateWeight: (assetPosition, newWeight) => {
      const isValid = isWeightUpdateValid(assetPosition, newWeight);
      if (isValid) {
        // Input in % terms, weights stored in decimal
        weights[assetPosition] = newWeight /100;
      }
      return isValid;
    },
    getWeight: (assetPosition) => weights[assetPosition],
    getWeights: () => weights,
  };
};

const withPortfolioValue = (state, startValue) => {
  // Purpose of this is to abstract away the portfolio
  // value so we can calculate this in nominal or
  // real terms

  const returnCalc = (acc, curr) => (1+curr)*acc;

  const currNominal = () => state.portfolio.getReturns().reduce(
      returnCalc, startValue).toFixed(2);

  return {
    getValue: () => currNominal(),
  };
};

const canStep = (state) => {
  const periodWeightedAssetReturnCalc = (periodReturn, assetWeight) => {
    // We subtract one because we track time in periods which start
    // from one rather than zero
    return assetWeight * periodReturn;
  };

  return {
    nextStep: () => {
      if (state.period.isValid() === false) return false;

      let periodPortfolioReturn = 0;

      // Calculate the return for the asset, weighted
      // by the allocation in the portfolio
      for (let i=0; i < state.assets.length; i++) {
        const assetReturns = state.assets[i].getReturn(state.period);
        const assetWeight = state.getWeight(i);

        if (typeof assetWeight === 'undefined') {
        // User input shouln't trigger this error
          throw Error('Asset weight not intialised');
        }
        periodPortfolioReturn += periodWeightedAssetReturnCalc(
            assetReturns, assetWeight);
      }

      state.portfolio.addReturn(periodPortfolioReturn);
      state.period.increment();

      // We return the validity of another step to the client
      // so that clients know whether they can call this method
      // again and expect a result
      return state.period.isValid();
    },
  };
};

const withPerformance = (state) => ({
  getPerformance: () => ({
    portfolioPerf: state.portfolio.getPerformance(),
    assetsPerf: state.assets.map((v) => v.getPerformance()),
  }),
});

const withCoreState = (state) => {
  return {
    assets: state.returns.map((v) => asset(v, state.period)),
    portfolio: asset([
    ], state.period),
  };
};

export const portfolio = (startVal, returns, samplePeriod = 40) => {
  const finalPeriod = returns.length ? returns[0].length : 0;
  // Note: Both position and weights make Portfolio non-
  // idempotent, so when we query at different times
  // we get different results. This seems okay as we
  // need to updated weights from client.

  const state = {
    // period start, period max value
    period: period(0, finalPeriod),
    returns,
  };

  const coreVals = Object.assign(
      state,
      withCoreState(state),
  );

  return Object.assign(
      coreVals,
      withPortfolioValue(state, startVal),
      withWeights(state),
      canStep(state),
      withPerformance(state),
  );
};


export const benchmarkPort = (startVal, returns, samplePeriod = 40) => {
  const port = portfolio(startVal, returns, samplePeriod);
  const weights = [
    30,
    30,
    20,
    20,
  ];
  weights.map((v, i) => port.tryUpdateWeight(i, v));

  port.getPerformance = () => ({
    portfolioPerf: port.portfolio.getPerformance(),
  });
  return port;
};

