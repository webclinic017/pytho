import React from "react"
import PropTypes from "prop-types"

import {
  select,
  selectAll,
} from 'd3-selection'

export const addButtonHook = (dispatcher) => {
  selectAll('.chart-timebutton-element')
      .on("click", (e) => 
        dispatcher.call("timebutton", undefined, e.target.name))
}

export const TimeButtons = ({onClick}) => {
  const titles = ["1m", "3m", "6m", "12m", "Max"]
  return (
    <div 
      id="chart-timebutton-wrapper">
    { 
      titles.map((t, i) => (
       <button 
        className="chart-timebutton-element"
        name={t}
        key={i}>
        {t}
        </button>
      ))
    }
    </div>
  )
}

TimeButtons.propTypes = {
  onClick: PropTypes.func.isRequired
}
