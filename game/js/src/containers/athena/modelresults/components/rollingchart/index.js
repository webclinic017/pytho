import React from 'react';
import PropTypes from 'prop-types';

import {
  ExposureAnalysisAlphaLineChart, ExposureAnalysisCoefsLineChart,
} from '@Components/charts';
import {
  annualiseRet,
} from '@Helpers';

export const RollingCoefsLineChart = ({
  data, independent,
}) => {
  const assetIds = Object.keys(independent);
  const assetNames = Object.keys(independent).map((a) => independent[a].name);
  const yValues = assetIds.map((assetId) => data.regressions.map((d) => d.coefficients.find(coef => coef.asset == assetId).coef));
  const dates = data.dates;

  return (
    <ExposureAnalysisCoefsLineChart
      labels={ assetNames }
      xValues={ dates }
      yValues={ yValues } />
  );
};

RollingCoefsLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  independent: PropTypes.object.isRequired,
};

export const RollingAlphaLineChart = ({
  data
}) => {
  const dates = data.dates
  const yValues = [
    data.regressions.map((d) => annualiseRet(d.intercept)),
  ];
  return (
    <ExposureAnalysisAlphaLineChart
      xValues={ dates }
      yValues={ yValues } />
  );
};

RollingAlphaLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
