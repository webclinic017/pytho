import React from 'react';

import {
  useSSPortfolio,
} from '@Components/reducers/ssportfolio';
import {
  CancelIcon,
} from '@Components/common';

const rowStyle = {
  display: 'flex',
};

const iconStyle = {
  paddingRight: '5px',
};

const wrapperStyle = {
  margin: '5px 0',
};

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
      <div
        style={ wrapperStyle }>
        {
          positions.map((i) => {
            return (
              <div
                style={ rowStyle }
                key={ portfolio.assets[i].id }>
                <CancelIcon
                  style={ iconStyle }
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
