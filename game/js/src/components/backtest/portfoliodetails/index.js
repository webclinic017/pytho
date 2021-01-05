import React from 'react';

import {
  useSSPortfolio,
} from '@Components/reducers/ssportfolio';
import {
  CancelIcon,
} from '@Components/common';


export const PortfolioDetails = (props) => {
  const {
    state,
    removeFromPortfolio,
  } = useSSPortfolio();

  const {
    portfolio,
  } = state;

  if (portfolio != null) {
    // Ascending array 1..number of positions in portfolio
    const positions = Array(portfolio.assets.length).fill().map((v, i) => i);

    return (
      <div>
        {
          positions.map((i) => {
            return (
              <div
                key={ portfolio.assets[i].id }>
                <CancelIcon
                  data-testid="backtest-removeassetbutton"
                  onClick={ () => removeFromPortfolio(i) } />
                {portfolio.assets[i].name}
                {' '}
                -
                {' '}
                {portfolio.weights[i]}
              </div>
            );
          })
        }
      </div>
    );
  }
  return <span />;
};
