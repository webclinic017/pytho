import React from 'react';

import {
  Title,
  NumberWithTitle,
} from '@Components/common';
import {
  strConverterMult,
  strConverter,
  annualiseRet,
} from '@Helpers';


const Independent = ({
  results, independent,
}) => {
  const coef = results.regressions.coefficients.find((coef) => coef.asset == independent.id).coef;

  return (
    <>
      <Title>
        {independent.name}
      </Title>
      <div
        style={
          {
            display: 'flex',
          }
        }>
        <NumberWithTitle
          title={ 'Coef' }
          number={ strConverter(coef) } />
      </div>
    </>
  );
};

const Independents = ({
  results, independent, dependent,
}) => {
  const assetIds = Object.keys(independent);
  return (
    <>
      <div
        style={
          {
            margin: '0.5rem 0 0 0',
          }
        }>
        {
          assetIds.map((assetId) => <Independent
            key={ assetId }
            results={ results }
            independent={ independent[assetId] } />)
        }
      </div>
    </>
  );
};

const Dependent = ({
  results, independent, dependent,
}) => {
  const annualisedAlpha = annualiseRet(results.regressions.intercept);

  return (
    <>
      <div
        style={
          {
            margin: '0.5rem 0 0 0',
          }
        }>
        <Title>
          {dependent.name}
        </Title>
        <div
          style={
            {
              display: 'flex',
            }
          }>
          <NumberWithTitle
            hasPercentage
            title={ 'Alpha' }
            number={ strConverterMult(annualisedAlpha) } />
        </div>
      </div>
    </>
  );
};

export const Drawdown = ({
  start, end, mean, stdev, count,
}) => {
  return (
    <div
      style={
        {
          'display': 'flex',
        }
      }>
      <span>
        {start}
        {' '}
        -
        {' '}
        {end}
      </span>
      <span>
        {mean}
      </span>
    </div>
  );
};

export const Drawdowns = ({
  results,
}) => {
  return (
    <div>
      {
        results.drawdowns.map((dd, i) => <Drawdown
          key={ i }
          { ...dd } />)
      }
    </div>
  );
};

export const DrawdownEstimatorResults = (props) => {
  return (
    <div>
      <Independents
        { ...props } />
      <Dependent
        { ...props } />
      <Drawdowns
        { ...props } />
    </div>
  );
};
