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
  const coef = results.regressions.coefficients.find(coef => coef.asset == independent.id).coef

  return (
    <React.Fragment>
      <Title>
        {independent.name}
      </Title>
      <div style={{display: 'flex'}}>
        <NumberWithTitle
          title={ 'Coef' }
          number={ strConverter(coef) } />
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
  const annualisedAlpha = annualiseRet(results.regressions.intercept)

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
       </div>
      </div>
    </React.Fragment>
  )
}

export const Drawdown = ({start, end, mean, stdev, count}) => {
  return (
    <div style={{'display': 'flex'}}>
      <span>{start} - {end}</span>
      <span>{mean}</span>
    </div>
  )

}

export const Drawdowns = ({results}) => {
  return (
    <div>
      {results.drawdowns.map(dd => <Drawdown {...dd} />)}
    </div>
  )
}

export const DrawdownEstimatorResults = (props) => {
  return (
    <div>
      <Independents {...props} />
      <Dependent {...props} />
      <Drawdowns {...props} />
    </div>
  )
}