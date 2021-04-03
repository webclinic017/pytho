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
  const size = {
    margin: {
      top: 10,
      right: 30,
      bottom: 30,
      left: 60,
    },
    width: 800 - 60 - 30,
    height: 400 - 10 - 30,
  };

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

  return (
    <div
      style={ wrapperStyle }>
      <LineChartWithBrush
        size={ size }
        data={ equityCurve } />
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
