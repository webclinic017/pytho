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


const Independent = ({
  results, independent,
}) => {
  const annualisedRet = annualiseMonthlyRet(
      results.avgs.find((avg) => avg.asset == independent.id).avg);
  const coef = results.regression.coefficients.find(
      (coef) => coef.asset == independent.id).coef;

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
        <NumberWithTitle
          hasPercentage
          title={ 'Avg Ret' }
          number={ strConverterMult(annualisedRet) } />
        <NumberWithTitle
          hasPercentage
          title={ 'Attr' }
          number={ strConverterMult(coef*annualisedRet) } />
      </div>
    </>
  );
};

Independent.propTypes = {
  results: PropTypes.shape({
    regression: PropTypes.shape({
      coefficients: PropTypes.arrayOf(
          PropTypes.shape({
            asset: PropTypes.number.isRequired,
            coef: PropTypes.number.isRequired,
          }),
      ),
    }),
    avgs: PropTypes.arrayOf(PropTypes.shape({
      asset: PropTypes.number.isRequired,
      avg: PropTypes.number.isRequired,
    })),
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

const Dependent = ({
  results, dependent,
}) => {
  const annualisedAvgRet = annualiseMonthlyRet(
      results.avgs.find((v) => v.asset == dependent.id).avg);
  const annualisedAlpha = annualiseMonthlyRet(results.regression.intercept);

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
          <NumberWithTitle
            hasPercentage
            title={ 'Avg Ret' }
            number={ strConverterMult(annualisedAvgRet) } />
        </div>
      </div>
    </>
  );
};

Dependent.propTypes = {
  results: PropTypes.shape({
    regression: PropTypes.shape({
      intercept: PropTypes.number.isRequired,
    }),
    avgs: PropTypes.arrayOf(PropTypes.shape({
      asset: PropTypes.number.isRequired,
      avg: PropTypes.number.isRequired,
    })),
  }),
  dependent: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export const CoreResultComponent = (props) => {
  return (
    <div>
      <Dependent
        { ...props } />
      <Independents
        { ...props } />
    </div>
  );
};
