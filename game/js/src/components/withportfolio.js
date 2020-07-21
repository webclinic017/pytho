import React from 'react'
import axios from 'axios'

import { portfolio, benchmarkPort } from '../helpers/portfolio.js'

/*
  Wraps portfolio functionality. Keeps the main app clean.
*/
export const withPortfolio = (WrappedComponent) => {

  return class PortfolioComponent extends React.Component {

    constructor(props) {
      super(props)
      
      this.state = {
        portfolio: null,
        benchmark: null,
        periods: [],
        startVal: 100,
        lastStep: -1
      }

      this.resetPortfolio = this.resetPortfolio.bind(this)
      this.nextStep = this.nextStep.bind(this)
      this.updateWeight = this.updateWeight.bind(this)
    }
   
    resetPortfolio() {
      axios.get(process.env.API_URL + "/api/sample")
        .then(res => res.data)
        .then(res => {
           const returns = res.data.map(v=> v.data)
           const periods = res.data.map(v=> v.period)
           const port = portfolio(
             this.state.startVal, returns)
           const benchmark = benchmarkPort(
             this.state.startVal, returns)
           this.setState({portfolio: port, periods, benchmark})
        })
    }
 

    nextStep() {
      //When we get to this point, we know that the next step is valid
      //but we need to determine whether the step after is valid
      //and whether we should show the button to client

      this.setState({ lastStep: Date.now()})
      this.state.benchmark.nextStep()
      return this.state.portfolio.nextStep()
    }

    updateWeight(assetPosition, value) {
      if (value == '' || value == ' '){
        return this.state.portfolio.tryUpdateWeight(
          assetPosition, 0)
      } else {
        return this.state.portfolio.tryUpdateWeight(
          assetPosition, value)
      }
    }

    componentDidMount() {
      if (this.state.portfolio == null) {
        axios.get(process.env.API_URL + "/api/sample")
          .then(res => res.data)
          .then(res => {
             const returns = res.data.map(v=> v.data)
             const periods = res.data.map(v=> v.period)
             const port = portfolio(
               this.state.startVal, returns)
             const benchmark = benchmarkPort(
               this.state.startVal, returns)
             this.setState({portfolio: port, periods, benchmark})
          })
      }
    }

    render(){
      return (
        <WrappedComponent
          {...this.state}
          resetPortfolio={this.resetPortfolio}
          nextStep={this.nextStep}
          updateWeight={this.updateWeight} />
      )
    }
  }
}

