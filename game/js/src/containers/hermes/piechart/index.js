import React, {
  useState, useRef, useEffect,
} from 'react';
import Chart from 'chart.js';
import axios from 'axios';

import {
  Button,
} from '@Common';
import {
  getCssVar,
} from '@Helpers';

import {
  ImageLink,
} from './components/imagelink';
import {
  usePortfolio,
} from '@Components/portfolio';

export const PieChart = (props) => {
  const [
    chart, setChart,
  ] = useState(null);
  const [
    link, setLink,
  ] = useState('');
  const chartRef = useRef(null);

  const {
    state,
  } = usePortfolio();

  // eslint-disable-next-line
  let assets = null;
  // eslint-disable-next-line
  let weights = null;

  useEffect(() => {
    if (state.portfolio != null) {
      const {
        // eslint-disable-next-line
        assets, weights,
      } = state.portfolio.getPortfolio();
    }

    if (assets && weights) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx === null) return;

      ctx.fillStyle = getCssVar('--default-background-color');
      ctx.fillRect(0, 0, chartRef.width, chartRef.height);

      const chartData = buildChartData({
        assets,
        weights,
      });
      const legend = {
        position: 'bottom',
        reverse: true,
        align: 'start',
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 18,
          fontColor: getCssVar('--default-text-color'),
        },
      };
      const plugins = [
        {
          beforeDraw: (chartInstance) => {
            chartInstance.chart.ctx.fillStyle = getCssVar(
                '--default-background-color');
            chartInstance.chart.ctx.fillRect(
                0, 0, chartInstance.chart.width, chartInstance.chart.height);
          },
        },
      ];
      const chart = new Chart(
          ctx,
          {
            type: 'pie',
            data: chartData,
            options: {
              legend,
            },
            plugins,
          },
      );
      setChart(chart);
    }

    if (assets && weights && chart) {
      const chartData = buildChartData({
        assets,
        weights,
      });
      chart.data = chartData;
      chart.update();
    }
  }, [
    assets, weights,
  ]);

  const getLink = (e) => {
    e.preventDefault();
    const base64 = chartRef.current.toDataURL('image/jpeg');
    axios.post(process.env.API_URL + '/api/chartshare', {
      'data': base64,
    })
        .then((resp) => resp.data)
        .then(({
          link,
        }) =>
          setLink(process.env.API_URL + '/static/images/' + link + '.jpeg'));
  };

  const getColors = (data) => {
    const colors = [
      '#003f5c',
      '#2f4b7c',
      '#665191',
      '#a05195',
      '#d45087',
      '#f95d6a',
      '#ff7c43',
      '#ffa600',
    ];
    return data.map((v, i) => colors[i%colors.length]);
  };

  const buildChartData = ({
    assets, weights,
  }) => {
    const data = weights.map((v) => parseFloat(v));
    const labels = assets.map((v, i) => v + ' - ' + weights[i]);
    const backgroundColor = getColors(data);
    return {
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
      labels,
    };
  };

  return (
    <div>
      <Button
        onClick={ getLink }>
        Build Link
      </Button>
      {
 link ? <ImageLink
   link={ link } /> : null
      }
      <canvas
        id="myChart"
        ref={ chartRef } />
    </div>
  );
};
