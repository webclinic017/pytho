import React, {
  useState,
} from 'react';

import {
  PortfolioSearch,
} from '@Components/portfoliosearch';
import {
  useSSPortfolio,
} from '@Components/reducers/ssportfolio';
import {
  FormWrapper,
  FormLabel,
  FormInput,
} from '@Components/form';
import {
  Button,
} from '@Common';

export const Builder = (props) => {
  const [
    shouldClear, setShouldClear,
  ] = useState(false);

  const {
    state,
    addToPortfolio,
    addWeight,
    addSecurity,
  } = useSSPortfolio();

  const {
    security,
    weight,
  } = state;

  const isFinished = security && weight != '';

  const clickFunc = () => {
    addToPortfolio(security, weight);
    setShouldClear(true);
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
            onChange={ (e) => addWeight(e.target.value) } />
          <FormLabel>
            Assets
          </FormLabel>
          <PortfolioSearch
            runAfterClear={ () => () => setShouldClear(false) }
            shouldClear={ shouldClear }
            selectHook={ addSecurity } />
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
