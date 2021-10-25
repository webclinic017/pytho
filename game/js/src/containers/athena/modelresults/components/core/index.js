import React from "react"

import {
  Title,
  NumberWithTitle,
} from '@Components/common';
import {
  strConverterMult,
  strConverter,
  annualiseRet,
} from '@Helpers';


const Independent = ({results, independent}) => {
  const annualisedRet = annualiseRet(results.avgs.find(avg => avg.asset == independent.id).avg)
  const coef = results.regression.coefficients.find(coef => coef.asset == independent.id).coef

  return (
    <React.Fragment>
      <Title>
        {independent.name}
      </Title>
      <div style={{display: 'flex'}}>
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
    </React.Fragment>
  )
}

const Independents = ({results, independent, dependent}) => {
  const assetIds = Object.keys(independent)
  return (
    <React.Fragment>
      <div
        style={
          {
            margin: '0.5rem 0 0 0',
          }
        }>
          { assetIds.map(assetId => <Independent results={results} independent={independent[assetId]} />)}
      </div>
    </React.Fragment>
  )
}

const Dependent = ({results, independent, dependent}) => {
  const annualisedAvgRet = annualiseRet(results.avgs.find(v => v.asset == dependent.id).avg)
  const annualisedAlpha = annualiseRet(results.regression.intercept)

  return (
    <React.Fragment>
      <div
        style={
          {
            margin: '0.5rem 0 0 0',
          }
        }>
        <Title>
          {dependent.name}
        </Title>
        <div style={{display: 'flex'}}>
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
    </React.Fragment>
  )
}

export const CoreResultComponent = (props) => {
  return (
    <div>
      <Dependent {...props} />
      <Independents {...props} />
    </div>
  )
}
