import React from 'react';

import {
  usePortfolio,
} from '@Components/portfolio';
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

export const PortfolioDisplay = (props) => {
  const {
    state,
    removeFromPortfolio,
  } = usePortfolio();

  const {
    portfolio,
  } = state;

  if (portfolio != null) {
    // Ascending array 1..number of positions in portfolio
    const positions = Array(portfolio.getLength()).fill().map((v, i) => i);
    const p = portfolio.getPortfolio();

    return (
      <div
        style={ wrapperStyle }>
        {
          positions.map((i) => {
            return (
              <div
                style={ rowStyle }
                key={ p.assets[i].id }>
                <CancelIcon
                  style={ iconStyle }
                  data-testid="backtest-removeassetbutton"
                  onClick={ () => removeFromPortfolio(i) } />
                {p.assets[i].name}
                {' '}
                -
                {' '}
                {p.weights[i]}
              </div>
            );
          })
        }
      </div>
    );
  }
  return <span />;
};
