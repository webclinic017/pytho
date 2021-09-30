import React from 'react';
import PropTypes from 'prop-types';

import {
  ExposureAnalysisAlphaLineChart, ExposureAnalysisCoefsLineChart,
} from '@Components/charts';
import {
  annualiseRet,
} from '@Helpers';

export const RollingCoefsLineChart = ({
  data, dates, independent,
}) => {
  const assetIds = Object.keys(independent);
  const assetNames = Object.keys(independent).map((a) => independent[a].name);
  const yValues = assetIds.map((assetId) => data.map((d) => d.coef[assetId]));

  return (
    <ExposureAnalysisCoefsLineChart
      labels={ assetNames }
      xValues={ dates }
      yValues={ yValues } />
  );
};

RollingCoefsLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dates: PropTypes.arrayOf(PropTypes.number).isRequired,
  independent: PropTypes.object.isRequired,
};

export const RollingAlphaLineChart = ({
  data, dates,
}) => {
  const yValues = [
    data.map((d) => annualiseRet(d.intercept)),
  ];
  return (
    <ExposureAnalysisAlphaLineChart
      xValues={ dates }
      yValues={ yValues } />
  );
};

RollingAlphaLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dates: PropTypes.arrayOf(PropTypes.number).isRequired,
};
