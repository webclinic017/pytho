import React from 'react';

import { useModel } from '@Components/reducers/riskattribution';
import {
  CancelIcon,
  Title,
  Text,
  Panel,
} from '@Common';

const renderRemoval = (val, removeFunc) => (
  <CancelIcon
    style={{ paddingRight: '0.25rem' }}
    onClick={ () => removeFunc(val) } />
);

const renderSingleIndependent = (variable, removeFunc) => (
  <Text
    style={
      {
        display: 'flex',
        alignItems: 'center',
      }
    }
    key={ variable.id }>
    {renderRemoval(variable.id, removeFunc)}
    {variable.name}
  </Text>
);

const renderIndependent = (independent, removeFunc) => {
  if (Object.keys(independent).length > 0) {
    return (
      <div
        style={{ margin: '0.5rem 0' }}>
        <Text>
          Independent
        </Text>
        {
          Object.keys(independent).map((v) =>
            renderSingleIndependent(
                independent[v],
                () => removeFunc(v),
            ))
        }
      </div>
    );
  }
  return null;
};

const renderDependent = (dependent, removeFunc) => {
  if (dependent != undefined) {
    return (
      <div
        style={{ margin: '0.5rem 0' }}>
        <Text>
          Dependent
        </Text>
        <Text
          style={
            { display: 'flex',
              alignItems: 'center' }
          }>
          {renderRemoval(dependent, () => removeFunc())}
          {dependent.name}
        </Text>
      </div>
    );
  }
  return null;
};

export const ModelDefinition = (props) => {
  const {
    removeDependent,
    removeIndependent,
    state,
  } = useModel();

  const {
    independent,
    dependent,
  } = state;

  if (dependent != undefined || Object.keys(independent).length > 0) {
    return (
      <Panel>
        <Title
          light>
          Definition
        </Title>
        {renderDependent(dependent, removeDependent)}
        {renderIndependent(independent, removeIndependent)}
      </Panel>
    );
  }
  return null;
};
