import React from "react"

import { PieChart } from '../components/piechart.js'
import { Button, MinusIcon } from '../components/common.js'
import { PortfolioShareInput } from '../components/portfolioshareinput.js'

export class PortfolioShareApp extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      securities: [],
      allocations: [],
      link: null
    }
    this.addSecurity = this.addSecurity.bind(this)
    this.removeSecurity = this.removeSecurity.bind(this)
  }

  removeSecurity(e) {
    const { value } = e.target
    const copySecurities = [...this.state.securities]
    const copyAllocations = [...this.state.allocations]
    
    copySecurities.splice(value, 1)
    copyAllocations.splice(value, 1)
    this.setState({
      securities: copySecurities,
      allocations: copyAllocations
    })
  }

  addSecurity({security, allocation}){
    const { securities, allocations } = this.state
    this.setState({
      securities: [security, ...securities],
      allocations: [allocation, ...allocations]
    })
  }

  renderRemovalButtons(){
    const { allocations, securities } = this.state
    return securities.map((v, i) => (
      <div key={i}
        value={i}
        style={{display: "flex", alignItems: "center"}}>
        <Button
          hasMargin={false}
          type={'icon'}
          onClickFunc={this.removeSecurity}>
          <MinusIcon />
        </Button>
        {v} - {allocations[i]}
      </div>
    ))
  }

  render(){
    return (
      <div id="portfolioshare-main">
        <PortfolioShareInput 
          addSecurity={this.addSecurity} />
        {this.renderRemovalButtons()}
        <PieChart
          {...this.state} />
      </div>
    )
  }
}
