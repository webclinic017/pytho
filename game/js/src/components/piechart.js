import React from "react"
import Chart from "chart.js"
import axios from 'axios'

import { Button } from './common.js'
import { ImageLink } from './imagelink.js'

export class PieChart extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      chart: null,
      link: ''
    }

    this.chartRef = React.createRef()

    this.getColors = this.getColors.bind(this)
    this.buildChartData = this.buildChartData.bind(this)
    this.getLink = this.getLink.bind(this)
  }

  getLink(e){
    e.preventDefault()
    const base64 = this.chartRef.current.toDataURL('image/jpeg')
    axios.post(process.env.API_URL + "/api/chartshare", {"data": base64})
      .then(resp => resp.data)
      .then(({link}) => this.setState({link: 'https://pytho.uk/static/images' + link + '.jpeg'}))
  }

  getColors(data) {
    const colors = [
      '#003f5c', 
      '#2f4b7c', 
      '#665191', 
      '#a05195', 
      '#d45087', 
      '#f95d6a', 
      '#ff7c43',
      '#ffa600']
    return data.map((v,i) => colors[i%colors.length])
  }

  buildChartData({securities, allocations}) {
    const data = allocations.map(v => parseFloat(v)) 
    const labels = securities.map((v, i) => v + " - " + allocations[i])
    const backgroundColor = this.getColors(data)
    return {
      datasets: [{
        data,
        backgroundColor
      }],
      labels
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {
      securities,
      allocations
    } = this.props

    if (securities && allocations && prevState.chart) {
      const { chart } = prevState
      const chartData = this.buildChartData(this.props)
      chart.data = chartData
      chart.update()
    }
  }

  componentDidMount() {
    const {
      securities,
      allocations
    } = this.props
    if (securities && allocations) {
      const ctx = this.chartRef.current.getContext("2d")
      if (ctx === null) return
      
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, this.chartRef.width, this.chartRef.height)

      const chartData = this.buildChartData(this.props)
      const legend = {
        position: 'bottom',
        reverse: true,
        align: 'start',
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 18,
          fontColor: '#080808'
        }
      }
      const plugins = [{
        beforeDraw: chartInstance => {
          chartInstance.chart.ctx.fillStyle = "white";
          chartInstance.chart.ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
      }]
      const chart = new Chart(ctx, { type: 'pie', data: chartData, options: { legend }, plugins})
      this.setState({ chart })
    }
  }

  render() {
    return (
      <div>
        <canvas
          id="myChart"
          ref={this.chartRef} />
        <Button
          onClickFunc={this.getLink}>
          Build Link
        </Button>
        <ImageLink
          link={this.state.link} />
      </div>
    )
  }

}
