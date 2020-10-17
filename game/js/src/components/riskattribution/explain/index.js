import React from "react"

import {
  Text
} from "@Common"
import { 
  Accordion
} from "@Components/accordion"

const textStyle = {
  padding: '1rem'
}

const WithMargin = props => <Text margin="0.5rem">{props.children}</Text>

export const ExplainRiskAttr = props => (
  <Accordion title={'Explain'}>
    <div className="pure-u-5-5" style={textStyle}>
      <WithMargin>Determine the sources of risk for a fund, etf, equity, or index.</WithMargin>
      <WithMargin>The returns that you are trying to explain is the dependent variable. The returns that you are using to explain the dependent is the independent variable. Therefore, you can add only one dependent but many independent variables.</WithMargin>
      <WithMargin>Our data source is limited. This is not a paid service so we are limited to data that is freely available, we have most stocks and indexes but our fund coverage is limited.</WithMargin>
      <WithMargin>Once you run the model, it will take 10-20 seconds to calculate. Due to the nature of our data sources, this time will increase as you add more independent variables.</WithMargin>
    </div>
  </Accordion>
)
