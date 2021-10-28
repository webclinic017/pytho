import React from 'react';
import PropTypes from 'prop-types';

import {
  LineChartWithBrush,
} from '@Components/charts';
import {
  NumberWithTitle,
} from '@Components/common';
import {
  strConverter,
} from '@Helpers';

export const PortfolioPerformance = ({
  results,
}) => {
  const {
    equityCurve,
    cagr,
    vol,
    maxdd,
  } = results;

  const wrapperStyle = {
    margin: '20px 0',
  };

  const numbersStyle = {
    display: 'flex',
    justifyContent: 'space-around',
  };

  const dates = equityCurve.map((d) => d[0]);
  const portfolioVals = [
    equityCurve.map((d) => d[1]),
  ];

  return (
    <div
      style={ wrapperStyle }>
      <LineChartWithBrush
        xValues={ dates }
        yValues={ portfolioVals } />
      <div
        style={ numbersStyle }>
        <NumberWithTitle
          hasPercentage={ true }
          title={ 'Cagr' }
          number={ strConverter(cagr * 100) } />
        <NumberWithTitle
          hasPercentage={ true }
          title={ 'Vol' }
          number={ strConverter(vol * 100) } />
        <NumberWithTitle
          hasPercentage={ true }
          title={ 'MaxDD' }
          number={ strConverter(maxdd * 100) } />
      </div>
    </div>
  );
};

PortfolioPerformance.propTypes = {
  results: PropTypes.shape({
    equityCurve: PropTypes.array.isRequired,
    cagr: PropTypes.number.isRequired,
    vol: PropTypes.number.isRequired,
    maxdd: PropTypes.number.isRequired,
  }),
};
