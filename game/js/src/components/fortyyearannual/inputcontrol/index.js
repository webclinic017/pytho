import React from "react"

import { WeightsInput } from './components/weightsinput'

import { useMessage } from '@Components/reducers/message'
import { usePortfolio } from '@Components/reducers/portfolio'
import { Button } from '@Common'

export const InputControl = props => {

  const { 
    state,
    loadPortfolio,
    nextStep
  } = usePortfolio()

  const {
    successMessage
  } = useMessage()

  const {
    isFinished,
    hasNextStep 
  } = state

  const runStep = e => {
    const res = nextStep(e)
    if(!res){
      successMessage("Sim complete")
    }
  }
  
  return (
    <div className="pure-g">
      <div className="pure-u-5-5">
        <WeightsInput />
      </div>
      <div className="pure-u-5-5">
        <Button
          disabled={!hasNextStep}
          onClick={runStep}>
          Next Step
        </Button>
        <Button
          disabled={!isFinished}
          onClick={() => loadPortfolio()}>
          Reset
        </Button>
      </div>
    </div>
  )
}
