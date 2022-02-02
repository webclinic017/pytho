import React from 'react';
import PropTypes from 'prop-types';

import {
  useModel,
} from '@Components/reducers/riskattribution';
import {
  useLoader,
} from '@Components/reducers/loader';
import {
  CancelIcon,
  Title,
  Text,
  Button,
} from '@Common';
import {
  ComponentWrapper,
  DefaultHorizontalSpacer,
} from '@Style';

const renderRemoval = (val, removeFunc) => (
  <CancelIcon
    style={
      {
        paddingRight: '0.25rem',
      }
    }
    onClick={ () => removeFunc(val) } />
);

const VariableRows = ({vals, title, removeFunc}) => {
  if (Object.keys(vals).length > 0) {
    return (
      <DefaultHorizontalSpacer>
        <Text
          light>
          {title}
        </Text>
        {
          Object.keys(vals).map((v) => {
            return (
              <DefaultHorizontalSpacer>
                <Text
                  style={
                    {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }
                  key={ v }>
                  {renderRemoval(v, removeFunc)}
                  {vals[v].name}
                </Text>
              </DefaultHorizontalSpacer>
            );
          })
        }
      </DefaultHorizontalSpacer>
    );
  } else {
    return null;
  }
}

VariableRows.propTypes = {
  title: PropTypes.string.isRequired,
  vals: PropTypes.object.isRequired,
  removeFunc: PropTypes.func.isRequired,
};

export const ModelDefinition = (props) => {
  const {
    removeDependent,
    removeIndependent,
    runCore,
    runDrawdownEstimator,
    state,
  } = useModel();

  const {
    state: loaderState,
    toggleLoader,
    renderLoader,
  } = useLoader();

  const {
    independent,
    dependent,
  } = state;

  const Loader = renderLoader();

  if (dependent != undefined || Object.keys(independent).length > 0) {
    const depToObj = {
      [dependent.id]: dependent,
    };

    return (
      <ComponentWrapper>
        <Title>
          Model Definition
        </Title>
        <DefaultHorizontalSpacer>
          <VariableRows
            removeFunc={removeDependent}
            title={ 'Dependent' }
            vals={ depToObj } />
          <VariableRows
            removeFunc={removeIndependent}
            title={ 'Independent' }
            vals={ independent } />
        </DefaultHorizontalSpacer>
        <div>
          <Button
            disabled={ loaderState.isLoading }
            onClick={ () => runCore(toggleLoader()) }>
            Run Core
          </Button>
          <Button
            disabled={ loaderState.isLoading }
            onClick={ () => runDrawdownEstimator(toggleLoader()) }>
            Run Drawdown
          </Button>
        </div>
        <div>
          <Loader />
        </div>
      </ComponentWrapper>
    );
  }
  return null;
};
