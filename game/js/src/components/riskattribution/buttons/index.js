import React from 'react';

import { useModel } from '@Components/reducers/riskattribution';
import { Button } from '@Components/common';

export const Buttons = (props) => {
  const {
    addDependent,
    addIndependent,
    runModel,
  } = useModel();

  return (
    <div
      data-testid="riskattribution-variables-input">
      <Button
        onClick={ () => addIndependent() }>
        Add Independent
      </Button>
      <Button
        onClick={ () => addDependent() }>
        Add Dependent
      </Button>
      <Button
        onClick={ () => runModel() }>
        Run Model
      </Button>
    </div>
  );
};
