import React, { useState } from "react"
import axios from 'axios';
import zip from 'lodash.zip';

import { PieChart } from '@Components/charts';
import { usePortfolio } from '@Components/portfolio';
import { Button } from '@Components/common';

const PieChartWrapper = (props) => {
  const {
    state,
    hasPortfolio,
  } = usePortfolio();

  if (hasPortfolio()) {
    const portfolio = state.portfolio.getPortfolio()
    const transposed = zip(portfolio.assets, portfolio.weights)
    return <PieChart data={transposed} />
  } else {
    return null;
  }
}

export const PieChartBuilder = (props) => {

  const [link, setLink] = useState('');

  const {
    hasPortfolio,
    getPortfolio
  } = usePortfolio()

  const getLink = (e) => {
    e.preventDefault();
    const base64 = document.getElementById('#chart-container')
      .toDataURL('image/jpeg');
    axios.post(process.env.API_URL + '/api/chartshare', {
      'data': base64,
    })
    .then((resp) => resp.data)
    .then(({
      link,
    }) =>
      setLink(process.env.API_URL + '/static/images/' + link + '.jpeg'));
  };

  return (
    <div>
      <Button
        disabled={!hasPortfolio()}
        onClick={getLink}>
        Build
      </Button>
      {
        link
        ? <ImageLink link={link} />
        : null
      }
      <PieChartWrapper />

    </div>
  )


}
