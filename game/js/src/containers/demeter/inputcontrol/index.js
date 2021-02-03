import React, {
  useState,
} from 'react';

import {
  useMessage,
} from '@Components/reducers/message';
import {
  useSimulation,
} from '@Components/reducers/simulation';
import {
  Button,
} from '@Common';
import {
  FormWrapper,
  FormLabel,
  FormInput,
} from '@Components/form';
import {
  isWeightValid,
} from './helpers';

export const InputControl = (props) => {
  const [
    weights, setWeights,
  ] = useState([
    0,
    0,
    0,
    0,
  ]);

  const [
    areWeightsValid, setWeightsValid,
  ] = useState(false);

  const {
    state,
    nextStep,
    startSim,
    resetSim,
  } = useSimulation();

  const {
    successMessage,
    errorMessage,
    clearMessage,
  } = useMessage();

  const {
    isRunning,
    hasNextStep,
  } = state;

  const weightChange = (e) => {
    e.preventDefault();
    clearMessage();
    const assetPosition = e.target.name;
    const value = e.target.value;

    const weightCopy = weights.slice();
    if (value == '' || value == ' ') {
      setWeightsValid(true);
      weightCopy[assetPosition] = 0.0;
      setWeights(weightCopy);
    } else {
      if (isWeightValid(value, assetPosition, weights)) {
        setWeightsValid(true);
        weightCopy[assetPosition] = parseFloat(value)/100;
        setWeights(weightCopy);
      } else {
        setWeightsValid(false);
        errorMessage('Weights Invalid');
      }
    }
  };

  const stepClick = (e) => {
    e.preventDefault();

    const onFinishHook = () => successMessage('Sim Complete');

    startSim();
    nextStep(weights, onFinishHook);
  };

  const resetClick = (e) => {
    e.preventDefault();
    resetSim();
  };

  const assetNamesDefault = [
    '  Equity 1',
    '  Equity 2',
    '    Bond 1',
    '    Bond 2',
  ];

  return (
    <div
      className="pure-g">
      <FormWrapper>
        <div
          className="pure-u-5-5"
          id="weights-input">
          {
            weights.map((w, i) => (
              <FormLabel
                key={ i }>
                {assetNamesDefault[i]}
                {' '}
                (%):
                <FormInput
                  type="text"
                  aria-label={ 'weight-input-' + `${i}` }
                  name={ i }
                  onChange={ weightChange } />
              </FormLabel>
            ))
          }
        </div>
        <div
          className="pure-u-5-5">
          <Button
            disabled={ isRunning || !hasNextStep || !areWeightsValid }
            onClick={ stepClick }>
            Next Step
          </Button>
          <Button
            disabled={ isRunning }
            onClick={ resetClick }>
            Reset
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
};
