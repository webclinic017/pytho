import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  Text,
  NumberWithTitle,
} from '@Components/common';

import {
  strConverterMult,
  strConverter,
  annualiseRet,
} from '@Helpers';


export const renderCoreIndependent = (coef, avg, independent) => {
  const annualisedAvgRet = annualiseRet(avg);
  return (
    <div
      key={ independent.id }
      style={
        {
          margin: '0.5rem 0 0 0',
        }
      }>
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
          number={ strConverterMult(annualisedAvgRet) } />
        <NumberWithTitle
          hasPercentage
          title={ 'Attr' }
          number={ strConverterMult(coef*annualisedAvgRet) } />
      </div>
    </div>
  );
};


export const renderCoreDependent = (results, dependent) => {
  const annualisedAvgRet = annualiseRet(results.avgs.dep);
  const annualisedAlpha = annualiseRet(results.intercept);
  return (
    <div
      key={ dependent.id }
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
  );
};

export const renderBootstrapIndependent = (coef, independent) => (
  <div
    key={ independent.id }
    style={
      {
        margin: '1rem 0 0 0',
      }
    }>
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
        number={ strConverter(coef[0]) } />
      <NumberWithTitle
        title={ 'Coef 95%' }
        number={ strConverterMult(coef[1]) } />
    </div>
  </div>
);

export const renderBootstrapDependent = (results, dependent) => (
  <div
    key={ dependent.id }
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
        title={ 'Alpha 5%' }
        number={ strConverterMult(annualiseRet(results[0])) } />
      <NumberWithTitle
        hasPercentage
        title={ 'Alpha 95%' }
        number={ strConverterMult(annualiseRet(results[1])) } />
    </div>
  </div>
);

export const DrawdownEstimatorResults = ({
  drawdown,
}) => {
  const {
    coefs,
    se,
    drawdowns,
  } = drawdown;

  const wrapperStyle = {
    paddingLeft: '5px',
  };

  return (
    <div>
      <Title>
        Estimator Results
      </Title>
      <Text
        light>
        Coefficients
      </Text>
      {
        Object.keys(coefs).map((coef, i) => {
          return (
            <div
              key={ i }
              style={ wrapperStyle }>
              <NumberWithTitle
                title={ coef }
                number={ strConverterMult(coefs[coef]) }
              />
            </div>
          );
        })
      }
      <Text
        light>
        Standard Errors
      </Text>
      {
        Object.keys(se).map((e, i) => {
          return (
            <div
              key={ i }
              style={ wrapperStyle }>
              <NumberWithTitle
                title={ e }
                number={ strConverterMult(se[e]) }
              />
            </div>
          );
        })
      }
      <Text
        light>
        Drawdowns
      </Text>
      {
        Object.keys(drawdowns).map((dd, i) => {
          return (
            <div
              key={ i }
              style={ wrapperStyle }>
              <Text>
                {`${dd}`}
              </Text>
              <Text>
                {`${strConverterMult(drawdowns[dd][0])}`}
              </Text>
            </div>
          );
        })
      }
    </div>
  );
};

DrawdownEstimatorResults.propTypes = {
  drawdown: PropTypes.shape({
    coefs: PropTypes.object.isRequired,
    se: PropTypes.object.isRequired,
    drawdowns: PropTypes.object.isRequired,
  }),
};
