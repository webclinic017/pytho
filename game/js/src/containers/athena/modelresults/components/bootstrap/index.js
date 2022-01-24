import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  NumberWithTitle,
} from '@Components/common';
import {
  strConverterMult,
  strConverter,
  annualiseMonthlyRet,
} from '@Helpers';


const Dependent = ({
  results, dependent,
}) => {
  const upper = annualiseMonthlyRet(results.intercept.upper);
  const lower = annualiseMonthlyRet(results.intercept.lower);

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

Dependent.propTypes = {
  results: PropTypes.shape({
    intercept: PropTypes.shape({
      upper: PropTypes.number.isRequired,
      lower: PropTypes.number.isRequired,
    }),
  }),
  dependent: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

const Independent = ({
  results, independent,
}) => {
  const coef = results.coefficients.find(
      (coef) => coef.asset == independent.id);
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

Independent.propTypes = {
  results: PropTypes.shape({
    coefficients: PropTypes.arrayOf(
        PropTypes.shape({
          asset: PropTypes.number.isRequired,
          upper: PropTypes.number.isRequired,
          lower: PropTypes.number.isRequired,
        }),
    ),
  }),
  independent: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

const Independents = ({
  results, independent,
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

Independents.propTypes = {
  results: PropTypes.object.isRequired,
  independent: PropTypes.object.isRequired,
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
