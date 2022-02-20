import React, {
  useState,
} from 'react';

import {
  useStockOverview,
} from '@Components/reducers/stockoverview';
import {
  ComponentWrapper,
} from '@Style';
import {
  Button,
} from '@Common';
import {
  AlphaSearch,
} from '@Components/portfolio';

export const EquitySearch = (props) => {
  /*
  Option here is to autoload when user clicks on a security.
  Probably not a good idea at the moment because of the issues
  with timing of requests to API and search showing stale results.
  */

  const [
    shouldClear,
    setShouldClear,
  ] = useState(false);
  const [
    security,
    setSecurity,
  ] = useState('');

  const {
    getOverview,
  } = useStockOverview();

  const onClickFunc = (e) => {
    e.preventDefault();
    getOverview(`${security.Code}.${security.Exchange}`);
  };

  return (
    <ComponentWrapper>
      <AlphaSearch
        runAfterClear={ () => setShouldClear(false) }
        shouldClear={ shouldClear }
        selectHook={ (s) => setSecurity(s) } />
      <Button
        onClick={ onClickFunc }>
        Load
      </Button>
    </ComponentWrapper>
  );
};
