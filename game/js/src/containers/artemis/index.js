import React from "react"

import {
  PageWrapper, 
  SectionWrapper
} from "@Style"
import {
  StockOverviewProvider
} from "@Components/reducers/stockoverview"

import {
  Results
} from "./components/results"

export const ArtemisApp = (props) => {
  return (
    <StockOverviewProvider>
      <PageWrapper>
        <SectionWrapper>
          <Results />
        </SectionWrapper>
      </PageWrapper>
    </StockOverviewProvider>
  )
}