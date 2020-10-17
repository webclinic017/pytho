import React from "react"

import { 
  FormWrapper,
  FormInput,
  FormLabel
} from '@Components/form'
import { usePortfolio } from '@Components/reducers/portfolio'
import { useMessage } from '@Components/reducers/message'

export const WeightsInput = props => {

  const {
    state,
    updateWeight
  } = usePortfolio()

  const {
    errorMessage,
    clearMessage
  } = useMessage()

  const {
    portfolio,
    isFinished
  } = state

  const inputLoader = (e) => {
    const res = updateWeight(e)
    if(!res){
      errorMessage('Weights Invalid')
    } else {
      clearMessage()
    }
  }

  const weights = portfolio != null 
    ? portfolio.getWeights()
    : []

  const assetNamesDefault = [
    '  Equity 1', 
    '  Equity 2', 
    '    Bond 1', 
    '    Bond 2']
  
  if (isFinished) {
    return null
  } else {
    return (
      <FormWrapper
        id="weights-input">
        {weights.map((w, i) => (
          <FormLabel key={i}>
            {assetNamesDefault[i]} (%):
            <FormInput
              type="text" 
              aria-label={"weight-input-" + `${i}`}
              name={i} 
              onChange={inputLoader} />
          </FormLabel>
        ))}
      </FormWrapper>
    )
  }
}
