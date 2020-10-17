import React from "react"

import { useModel } from '@Components/reducers/riskattribution'
import {
  Panel,
  Title,
  Text
} from '@Components/common'

const strConverterMult = scalar => (scalar*100).toPrecision(2)
const strConverter = scalar => (scalar).toPrecision(2)

const cellStyle = {
  display: 'flex',
  alignItems: 'flex-start', 
  justifyContent: 'flex-start',
  marginLeft: '0.25rem'
}

const renderIndependent = (coef, avg, independent) => (
  <div>
    <Title light>{independent.name}</Title>
    <div style={{display: 'flex'}}>
      <div style={{margin: '0.5rem 0.5rem 0 0'}}>
        <Title>Coef</Title>
        <span style={cellStyle}>
          <Text number highlight>{strConverter(coef)}</Text>
        </span>
      </div>
      <div style={{margin: '0.5rem 0.5rem 0 0'}}>
        <Title>Avg Ret</Title>
        <span style={cellStyle}>
          <Text number highlight>{strConverterMult(avg)}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
      <div style={{margin: '0.5rem 0.5rem 0 0'}}>
        <Title>Attr</Title>
        <span style={cellStyle}>
          <Text number highlight>{strConverterMult(coef*avg)}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
    </div>
  </div>
)

const renderDependent = (results, dependent) => (
  <div>
    <Title light>{dependent.name}</Title>
    <div style={{display: 'flex'}}>
      <div style={{margin: '0.5rem 0.5rem 0 0'}}>
        <Title>Alpha</Title>
        <span style={cellStyle}>
          <Text number highlight>{strConverterMult(results.intercept)}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
      <div style={{margin: '0.5rem 0.5rem 0 0'}}>
        <Title>Avg Ret</Title>
        <span style={cellStyle}>
          <Text number highlight>{strConverterMult(results.avgs.dep)}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
    </div>
  </div>
)

export const ModelResults = (props) => {

  const { state } = useModel()
  const { 
    results,  
    independent,
    dependent 
  } = state

  if (results.intercept != undefined) {
    return (
      <Panel>
       { renderDependent(results, dependent) }
        {Object.entries(results.coef).map(v => {
          const independentObj = independent[v[0]]
          const avgObj = results.avgs.ind[v[0]]
          return renderIndependent(
            v[1], avgObj, independentObj)
        })}
      </Panel>
    )
  }
  return null

}
