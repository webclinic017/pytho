import React, {
  useState,
} from 'react';

import {
  Button,
} from '@Common';
import {
  usePortfolio
} from '@Components/portfolio';

import {
  PortfolioSaver
} from './components/saver';
import {
  BuilderForm
} from './components/form';

export const PortfolioBuilder = (props) => {
  const [
    showSaver, setShowSaver,
  ] = useState(false);
  const {
    state
  } = usePortfolio();

  return (
    <div
      className="pure-g">
      <div
        className="pure-u-5-5">
        <BuilderForm />
        <Button
          disabled={!state.portfolio || !state.portfolio.getLength() > 0}
          onClick={ () => setShowSaver(!showSaver) }>
          Save portfolio
        </Button>
      </div>
      <PortfolioSaver
        setShowSaver={setShowSaver}
        showSaver={showSaver}/>
    </div>
  );
};
