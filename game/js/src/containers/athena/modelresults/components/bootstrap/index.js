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


const Dependent = ({
  results, dependent,
}) => {
  const upper = annualiseRet(results.intercept.upper);
  const lower = annualiseRet(results.intercept.lower);

  return (
    <>
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
          title={ 'Alpha 5%' }
          number={ strConverterMult(lower) } />
        <NumberWithTitle
          hasPercentage
          title={ 'Alpha 95%' }
          number={ strConverterMult(upper) } />
      </div>
    </>
  );
};

const Independent = ({
  results, independent,
}) => {
  const coef = results.coefficients.find((coef) => coef.asset == independent.id);
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
          title={ 'Coef 5%' }
          number={ strConverter(coef.lower) } />
        <NumberWithTitle
          title={ 'Coef 95%' }
          number={ strConverterMult(coef.upper) } />
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


export const BootstrapResultComponent = (props) => {
  return (
    <div>
      <Dependent
        { ...props } />
      <Independents
        { ...props } />
    </div>

  );
};
