import React, {
  useState,
} from 'react';

import {
  PortfolioSearch,
  usePortfolio,
} from '@Components/portfolio';
import {
  FormWrapper,
  FormLabel,
  FormInput,
} from '@Components/form';
import {
  Button,
} from '@Common';

export const PortfolioBuilder = (props) => {
  const [
    shouldClear, setShouldClear,
  ] = useState(false);

  const [
    weight, setWeight,
  ] = useState('');

  const [
    security, setSecurity,
  ] = useState('');

  const {
    addToPortfolio,
  } = usePortfolio();

  const isFinished = security && weight != '';

  const clickFunc = () => {
    addToPortfolio(security, weight);
    setShouldClear(true);
    setWeight('');
    setSecurity('');
  };

  return (
    <div
      className="pure-g">
      <div
        className="pure-u-5-5">
        <FormWrapper>
          <FormLabel>
            Weights (%)
          </FormLabel>
          <FormInput
            data-testid="backtest-weight-input"
            type="text"
            name="weight"
            value={ weight }
            onChange={ (e) => setWeight(e.target.value) } />
          <FormLabel>
            Assets
          </FormLabel>
          <PortfolioSearch
            runAfterClear={ () => setShouldClear(false) }
            shouldClear={ shouldClear }
            selectHook={ (s) => setSecurity(s) } />
        </FormWrapper>
      </div>
      <div
        className="pure-u-5-5">
        <Button
          disabled={ !isFinished }
          onClick={ () => clickFunc() }>
          Add to portfolio
        </Button>
      </div>
    </div>
  );
};
