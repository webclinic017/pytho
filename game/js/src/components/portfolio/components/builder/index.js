import React, {
  useState,
} from 'react';

import {
  Button,
} from '@Common';
import {
  usePortfolio,
} from '@Components/portfolio';

import {
  PortfolioSaver,
} from './components/saver';
import {
  BuilderForm,
} from './components/form';

export const PortfolioBuilder = (props) => {
  const [
    showSaver,
    setShowSaver,
  ] = useState(false);
  const {
    state,
  } = usePortfolio();

  const {
    isEmpty,
  } = state;

  return (
    <div
      className="pure-g">
      <div
        className="pure-u-5-5">
        <BuilderForm />
        <Button
          disabled={ isEmpty }
          onClick={ () => setShowSaver(!showSaver) }>
          Save portfolio
        </Button>
      </div>
      <PortfolioSaver
        setShowSaver={ setShowSaver }
        showSaver={ showSaver } />
    </div>
  );
};
