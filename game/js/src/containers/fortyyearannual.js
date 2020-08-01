import React from 'react'

import { WeightsInput } from '../components/weightsinput.js'
import { PortfolioCurrent } from '../components/portfolioinfo.js'
import { withPortfolio } from '../components/withportfolio.js'
import { PortfolioPerformance } from '../components/portfolioperf.js'
import { FortyYearSimExplainer } from '../components/comparison.js'
import { 
  Button,
  Message,
  RenderIf
 } from '../components/common.js'

class FortyYearAnnualApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      errorMessage: '',
      successMessage: '',
      showNextStep: false,
      isFinished: false,
    }
    this.resetPortfolio = this.resetPortfolio.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.updateWeight = this.updateWeight.bind(this)
  }

  resetPortfolio(e) {
    this.props.resetPortfolio()
    this.setState({
      errorMessage: '',
      successMessage: '',
      showNextStep: false,
      isFinished: false
    })
  }

  nextStep(e) {
    e.preventDefault()
    const didStep = this.props.nextStep()

    if(!didStep){
      this.setState({
        successMessage: "Sim Complete",
        showNextStep: false,
        isFinished: true })
    }   
  }

  updateWeight(e) {
    e.preventDefault()
    const value = e.target.value
    const assetPosition = e.target.name

    const didUpdate = this.props.updateWeight(
      assetPosition, value)

    if(!didUpdate){
      this.setState({
        errorMessage: "Weights invalid",
        showNextStep: false})
    } else {
      this.setState({
        errorMessage: "",
        showNextStep: true})
    }
  }

  render() {

    return (
      <div id="game-wrapper" data-testid="app">

        <RenderIf 
          cond={this.state.errorMessage}>
          <Message
            type="error">
            {this.state.errorMessage}
          </Message>
        </RenderIf>

        <RenderIf 
          cond={this.state.successMessage}>
          <Message
            type="success">
            {this.state.successMessage}
          </Message>
        </RenderIf>

        <div id="info-panel">
          <PortfolioCurrent  
            {...this.props} 
            {...this.state} />
        </div>

        <div id="input-panel">
          <WeightsInput
            {...this.state}
            {...this.props}
            onChangeFunc={this.updateWeight} />
          <RenderIf 
            cond={this.state.showNextStep}>
            <Button
              type="success"
              onClickFunc={this.nextStep}>
              Next Step
            </Button>
          </RenderIf>
          <RenderIf 
            cond={this.state.isFinished}>
            <Button
              onClickFunc={this.resetPortfolio}>
              Reset
            </Button>
          </RenderIf>
        </div>
   
        <div id="game-performance">
          <PortfolioPerformance 
            {...this.state}
            {...this.props} />
        </div>

        <div id="game-explainer">
          <RenderIf
            cond={this.state.isFinished}>
            <FortyYearSimExplainer />
          </RenderIf>
        </div>
  
     </div>
    )
  }
}

export const FortyYearAnnualAppWithPortfolio = withPortfolio(FortyYearAnnualApp)
