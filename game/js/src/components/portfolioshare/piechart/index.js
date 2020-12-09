import React, {
  useState, useRef, useEffect,
} from 'react';
import Chart from 'chart.js';
import axios from 'axios';
import PropTypes from 'prop-types';

import {
  Button,
} from '@Common';
import {
  getCssVar,
} from '@Helpers';

import {
  ImageLink,
} from './components/imagelink';

export const PieChart = (props) => {
  const [
    chart, setChart,
  ] = useState(null);
  const [
    link, setLink,
  ] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    const {
      securities,
      allocations,
    } = props;

    if (securities && allocations) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx === null) return;

      ctx.fillStyle = getCssVar('--default-background-color');
      ctx.fillRect(0, 0, chartRef.width, chartRef.height);

      const chartData = buildChartData(props);
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

    if (securities && allocations && chart) {
      const chartData = buildChartData(props);
      chart.data = chartData;
      chart.update();
    }
  }, [
    props.securities, props.allocations,
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
    securities, allocations,
  }) => {
    const data = allocations.map((v) => parseFloat(v));
    const labels = securities.map((v, i) => v + ' - ' + allocations[i]);
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

PieChart.propTypes = {
  securities: PropTypes.arrayOf(PropTypes.string),
  allocations: PropTypes.arrayOf(PropTypes.string),
};
