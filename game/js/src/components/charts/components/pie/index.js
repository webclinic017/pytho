import React, { useContext, useEffect, useState } from "react";

import {
  ChartContext,
} from '../container';
import {
  BaseChart,
} from '../base';
import {
  pieChartBuilder
} from './helpers/pie.config.js';

export const PieChart = ({
  size,
  data,
  constantsBuilder,
}) => {

  const [first, setFirst] = useState(true)
  const context = useContext(ChartContext);
  const constants = constantsBuilder(data, context);
  const {
    dispatcher,
  } = constants;
  const {
    init,
    changed,
  } = pieChartBuilder(constants, size);

  const dispatchers = {
    'start': () => {
      init();
      setFirst(false)
    },
    'dataChange': (data) => {
      changed(data);
    }
  };

  Object.keys(dispatchers).map((e) => {
    dispatcher.on(e, dispatchers[e]);
  })

  useEffect(() => {
    if (!first){
      dispatcher.call("dataChange", undefined, data)
    }
  }, [data])

  return (
    <>
      <BaseChart
        dispatcher={ dispatcher }
        dispatchers={ dispatchers }
        size={ size } />
    </>
  );
};

