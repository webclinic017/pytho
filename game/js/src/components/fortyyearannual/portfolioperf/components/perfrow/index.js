import React from "react"

import { 
  Text,
  Title
} from '@Common'

export const PerfRow = ({ data, title, first, period }) => {
  const strConverter = scalar => (scalar*100).toPrecision(2)
  const cellStyle = {
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'flex-end'
  }

  return (
    <div className="pure-g">
      { first && (
        <React.Fragment>
          <Title light align="right" className="pure-u-8-24">CAGR</Title>
          <Title light align="right" className="pure-u-8-24">Vol</Title>
          <Title light align="right" className="pure-u-8-24">MDD</Title>
        </React.Fragment>
        )
      }
 
      <Title
        light
        align="right"
        style={{marginTop: '0.5rem'}}
        className="pure-u-24-24">
         {period ? period: ''} {title} 
      </Title>
      <div className="pure-u-8-24">
        <span style={cellStyle}>
          <Text number highlight>{strConverter(data['CAGR'])}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
      <div className="pure-u-8-24">
        <span style={cellStyle}>
          <Text number highlight>{strConverter(data['Vol'])}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
      <div className="pure-u-8-24">
        <span style={cellStyle}>
          <Text number highlight>{strConverter(data['MDD'])}</Text>
          <Text light margin={'0'}>%</Text>
        </span>
      </div>
    </div>
  )
}
