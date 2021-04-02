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

export const PieChart = ({data}) => {
  const [first, setFirst] = useState(true)
  const context = useContext(ChartContext);
  const {
    dispatcher,
    builderFuncs,
  } = context;

  const {
    init,
    changed
  } = builderFuncs;

  const dispatchers = {
    'start': () => {
      init(data);
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
      <BaseChart />
    </>
  );
};

