import React from "react"
import { render } from 'react-dom'

import { PortfolioShareApp } from './components/portfolioshare'

const portfolioShareEl = document.getElementById('portfolioshare-app')
render(<PortfolioShareApp />, portfolioShareEl)
