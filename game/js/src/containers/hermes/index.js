import React, {
  useState,
} from 'react';

import {
  PieChart,
} from './piechart';
import {
  PortfolioShareInput,
} from './input';

import {
  CancelIcon,
} from '@Common';

export const HermesApp = (props) => {
  const [
    securities, useSecurities,
  ] = useState([
  ]);
  const [
    allocations, useAllocations,
  ] = useState([
  ]);

  const addSecurity = ({
    security, allocation,
  }) => {
    useSecurities([
      security, ...securities,
    ]);
    useAllocations([
      allocation, ...allocations,
    ]);
  };

  const removeSecurity = (e) => {
    const {
      value,
    } = e.target;
    const copySecurities = [
      ...securities,
    ];
    const copyAllocations = [
      ...allocations,
    ];

    copySecurities.splice(value, 1);
    copyAllocations.splice(value, 1);
    useSecurities(copySecurities);
    useAllocations(copyAllocations);
  };

  const renderRemovalButtons = () => {
    return securities.map((v, i) => (
      <div
        key={ i }
        value={ i }
        style={
          {
            display: 'flex',
            alignItems: 'center',
            margin: '0.5rem 0',
          }
        }>
        <CancelIcon
          data-testid="portfolioshare-remove"
          style={
            {
              paddingRight: '0.5rem',
            }
          }
          onClick={ removeSecurity } />
        {v}
        {' '}
        -
        {allocations[i]}
      </div>
    ));
  };


  return (
    <div
      id="portfolioshare-main">
      <PortfolioShareInput
        addSecurity={ addSecurity } />
      {renderRemovalButtons()}
      <PieChart
        securities={ securities }
        allocations={ allocations } />
    </div>
  );
};
