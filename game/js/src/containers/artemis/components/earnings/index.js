import React from "react";

import { ComponentWrapper } from "@Style";

import { EarningsActualTable } from "./components/actual";
import { EarningsEstimatesTable } from "./components/estimates";

export const Earnings = ({ earnings }) => {
  return (
    <React.Fragment>
      <ComponentWrapper>
        <EarningsActualTable earnings={earnings} />
        <EarningsEstimatesTable earnings={earnings} />
      </ComponentWrapper>
    </React.Fragment>
  )
}