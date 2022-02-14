import React from "react"
import styled from "styled-components"

import {
  Text
} from '@Common'
import {
  DefaultHorizontalSpacer
} from '@Style'

const CellWrapper = styled.td`
  min-width: 75px
`

const Cell = ({value}) => {
  return <CellWrapper><Text number small>{value}</Text></CellWrapper>
}

const FirstCell = styled.td`
  min-width: 140px;
  width: 140px;
  display: flex;
  justify-content: flex-start;
  background-color: var(--default-background-color);
`

const Row = ({values, title, isSubSection}) => {
  return (
    <tr>
      <FirstCell>
        {
          isSubSection ?
          <DefaultHorizontalSpacer>
            <Text light>{title}</Text>
          </DefaultHorizontalSpacer> :
          <Text>{title}</Text>
        }
      </FirstCell>
      {values && values.map((r, i) => <Cell key={i} value={r} />)}
    </tr>
  )
}

export const Table = ({fundamentals}) => {
  
  const tableStyle = {
    overflowX: 'scroll',
    maxWidth: '700px',
    display: 'block',
    width: '700px',
  }

  const firstColOverlayStyle = {
    top: "0px",
    width: "140px",
    minWidth: "140px",
    left: "-2px",
    display: "flex",
    justifyContent: "flex-start",
    position: "absolute",
  }

  const sections = Object.keys(fundamentals.titles)
  const stringWrapper = val => parseFloat(val).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})

  return (
    <div style={{display: "block", position: "relative", margin: "2rem"}}>
      <div>
        <table style={tableStyle}>
          <thead>
            <Row values={fundamentals.dates.map(v => v.substring(0,4))} title={'Date'} />
          </thead>
          <tbody>
            {
              sections.map((s, i)=> {
                const section = fundamentals.titles[s]
                const names = Object.keys(section)
                const rows = names.map((n, i) => <Row key={i} isSubSection values={fundamentals[n].map(stringWrapper)} title={section[n]} />)
                return(
                  <React.Fragment key={i}>
                    <Row title={s} />
                    {rows}
                  </React.Fragment>
                )
              })
            }
          </tbody>
        </table>
      </div>

      <div style={firstColOverlayStyle}>
        <table>
          <thead>
            <Row title={'Date'} />
          </thead>
          <tbody>
            {
              sections.map((s, i) => {
                const section = fundamentals.titles[s]
                const names = Object.keys(fundamentals.titles[s])
                const rows = names.map((n, i) => <Row key={i} isSubSection title={section[n]} />)
                return (
                  <React.Fragment key={i}>
                    <Row title={s} />
                    {rows}
                  </React.Fragment>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )

}