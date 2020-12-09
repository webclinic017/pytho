import React, {
  useState, useRef, useEffect,
} from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

import {
  annualiseRet, getCssVar,
} from '@Helpers';

export const RollingCoefBarChart = (props) => {
  const [
    chart, setChart,
  ] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const {
      data,
    } = props;

    if (data) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx === null) return;

      ctx.fillStyle = getCssVar('--alt-background-color');
      ctx.fillRect(0, 0, chartRef.width, chartRef.height);

      const chartData = buildChartData(props);
      const legend = {
        position: 'bottom',
        reverse: true,
        align: 'start',
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 12,
          fontColor: getCssVar('--default-text-color'),
        },
      };
      const scales = {
        xAxes: [
          {
            type: 'time',
            ticks: {
              fontColor: getCssVar('--default-text-color'),
            },
            time: {
              unit: 'quarter',
              displayFormats: {
                quarter: 'Q/YY',
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: getCssVar('--default-text-color'),
            },
          },
        ],
      };
      const plugins = [
        {
          beforeDraw: (chartInstance) => {
            chartInstance.chart.ctx.fillStyle = getCssVar(
                '--alt-background-color');
            chartInstance.chart.ctx.fillRect(
                0, 0, chartInstance.chart.width, chartInstance.chart.height);
          },
        },
      ];
      const chart = new Chart(
          ctx,
          {
            type: 'line',
            data: chartData,
            options: {
              legend,
              scales,
              tooltips: {
                enabled: false,
              },
              hover: {
                mode: null,
              },
            },
            plugins,
          },
      );
      setChart(chart);
    }

    if (data && chart) {
      const chartData = buildChartData(props);
      chart.data = chartData;
      chart.update();
    }
  }, [
  ]);

  const getColors = (data) => {
    const colors = [
      '#90E39A',
      '#F38D68',
      '#1B9AAA',
      '#a05195',
      '#662C91',
      '#F3CA40',
      '#E71D36',
      '#E56B70',
      '#F75C03',
      '#FC6DAB',
    ];
    return data.map((v, i) => colors[i%colors.length]);
  };

  const buildChartData = ({
    data, dates, independent,
  }) => {
    const assets = Object.keys(independent).map((v)=> [
      v, independent[v]['name'],
    ]);
    const coefData = assets.map((a) => data.map((d)=> d['coef'][a[0]]));
    const chartColors = getColors(assets);

    const datasets = coefData.map((d) => {
      return {
        data: d,
        fill: false,
        pointRadius: 0,
      };
    });
    assets.map((a, i) => datasets[i].label = a[1]);
    chartColors.map((c, i) => datasets[i].backgroundColor = c);
    chartColors.map((c, i) => datasets[i].borderColor = c);

    return {
      datasets,
      labels: dates.map((d)=> new Date(d*1000)),
    };
  };

  return (
    <div>
      <canvas
        id="myChart"
        ref={ chartRef } />
    </div>
  );
};

RollingCoefBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dates: PropTypes.arrayOf(PropTypes.number).isRequired,
  independent: PropTypes.object.isRequired,
};

export const RollingAlphaBarChart = (props) => {
  const [
    chart, setChart,
  ] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const {
      data,
    } = props;

    if (data) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx === null) return;

      ctx.fillStyle = getCssVar('--alt-background-color');
      ctx.fillRect(0, 0, chartRef.width, chartRef.height);

      const chartData = buildChartData(props);
      const legend = {
        position: 'bottom',
        reverse: true,
        align: 'start',
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 12,
          fontColor: getCssVar('--default-text-color'),
        },
      };
      const scales = {
        xAxes: [
          {
            type: 'time',
            ticks: {
              fontColor: getCssVar('--default-text-color'),
            },
            time: {
              unit: 'quarter',
              displayFormats: {
                quarter: 'Q/YY',
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: getCssVar('--default-text-color'),
            },
          },
        ],
      };
      const plugins = [
        {
          beforeDraw: (chartInstance) => {
            chartInstance.chart.ctx.fillStyle = getCssVar(
                '--alt-background-color');
            chartInstance.chart.ctx.fillRect(
                0, 0, chartInstance.chart.width, chartInstance.chart.height);
          },
        },
      ];
      const chart = new Chart(
          ctx,
          {
            type: 'line',
            data: chartData,
            options: {
              legend,
              scales,
              tooltips: {
                enabled: false,
              },
              hover: {
                mode: null,
              },
            },
            plugins,
          },
      );
      setChart(chart);
    }

    if (data && chart) {
      const chartData = buildChartData(props);
      chart.data = chartData;
      chart.update();
    }
  }, [
  ]);

  const buildChartData = ({
    data, dates,
  }) => {
    const alpha = data.map((v) => annualiseRet(v.intercept));
    const backgroundColor = '#FE6D73';
    return {
      datasets: [
        {
          label: 'Alpha',
          data: alpha,
          backgroundColor,
          borderColor: backgroundColor,
          fill: false,
          pointRadius: 0,
        },
      ],
      labels: dates.map((d)=> new Date(d*1000)),
    };
  };

  return (
    <div>
      <canvas
        id="myChart"
        ref={ chartRef } />
    </div>
  );
};

RollingAlphaBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

