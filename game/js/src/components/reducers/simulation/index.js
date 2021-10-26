import React from 'react';
import axios from 'axios';

import {
  useMessage,
} from '@Components/reducers/message';

const initialState = {
  position: 0,
  simData: null,
  simResults: null,
  benchmarkResults: null,
  weights: [
  ],
  startVal: 100,
  hasNextStep: true,
  isRunning: false,
};

const actionTypes = {
  step: 'STEP',
  reset: 'RESET',
  start: 'START',
  stop: 'STOP',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.start:
      return {
        ...state,
        isRunning: true,
      };
    case actionTypes.stop:
      return {
        ...state,
        isRunning: false,
      };
    case actionTypes.reset:
      return initialState;
    case actionTypes.step:
      const position = state.position + 1;
      return {
        ...state,
        position,
        weights: action.weights,
        simData: action.data.sim_data,
        simResults: action.data.simportfolio,
        benchmarkResults: action.data.benchmarkportfolio,
        hasNextStep: position < 40,
      };
    default:
      new Error('Unknown action type');
  }
};

const SimulationContext = React.createContext();

export const useSimulation = () => {
  const context = React.useContext(SimulationContext);
  const {
    state, dispatch,
  } = context;

  const {
    errorMessage,
  } = useMessage();

  const startSim = () => dispatch({
    type: 'START',
  });
  const stopSim = () => dispatch({
    type: 'STOP',
  });
  const resetSim = () => dispatch({
    type: 'RESET',
  });

  const successfulStep = (data, weights) => {
    dispatch({
      type: 'STEP',
      data,
      weights,
    });
    stopSim();
  };


  const makeReq = (postData, updatedWeights) => {
    const baseString = '/api/portfoliosim';
    axios.post(process.env.API_URL + baseString, postData)
        .then((res) => res.data)
        .then((res) => successfulStep(res, updatedWeights))
        .catch((error) => {
          if (error.response) {
            errorMessage(error.response.data.message);
          } else if (error.request) {
            errorMessage('No response');
          } else {
            errorMessage(error.message);
          }
        });
  };

  const addWeightsToState = (weights) => {
    if (state.weights.length == 0) {
      return [
        weights,
      ];
    }
    const currWeights = JSON.parse(JSON.stringify(state.weights));
    currWeights.push(weights);
    return currWeights;
  };

  const nextStep = (weights, onFinishHook) => {
    const postData = {};
    if (state.position == 0) {
      const updatedWeights = addWeightsToState(weights);
      postData['weights'] = updatedWeights;
      postData['startval'] = state.startVal;
      makeReq(postData, updatedWeights);
    } else {
      const updatedWeights = addWeightsToState(weights);
      postData['weights'] = updatedWeights;
      postData['startval'] = state.startVal;
      postData['sim_position'] = state.position + 1;
      postData['sim_data'] = state.simData;
      makeReq(postData, updatedWeights);

      if (state.position + 1 == 40) {
        onFinishHook();
      }
    }
  };

  return {
    state,
    nextStep,
    resetSim,
    startSim,
  };
};

export const SimulationProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <SimulationContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
