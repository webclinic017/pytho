import React from "react"
import { render } from 'react-dom'

import { PortfolioShareApp } from './containers/portfolioshare.js'

const portfolioShareEl = document.getElementById('portfolioshare-app')
render(<PortfolioShareApp />, portfolioShareEl)
