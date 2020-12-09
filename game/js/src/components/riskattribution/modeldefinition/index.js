import React from 'react';

import {
  useModel,
} from '@Components/reducers/riskattribution';
import {
  CancelIcon,
  Title,
  Text,
  Button,
} from '@Common';

const renderRemoval = (val, removeFunc) => (
  <CancelIcon
    style={
      {
        paddingRight: '0.25rem',
      }
    }
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
        style={
          {
            margin: '0.5rem 0',
          }
        }>
        <Text
          light>
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
        style={
          {
            margin: '0.5rem 0',
          }
        }>
        <Text
          light>
          Dependent
        </Text>
        <Text
          style={
            {
              display: 'flex',
              alignItems: 'center',
            }
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
    runCore,
    runBootstrap,
    runRolling,
    state,
  } = useModel();

  const {
    independent,
    dependent,
  } = state;

  if (dependent != undefined || Object.keys(independent).length > 0) {
    return (
      <div
        style={
          {
            margin: '1rem 0',
          }
        }>
        <Title>
          Model Definition
        </Title>
        <div
          style={
            {
              padding: '0 0.5rem',
            }
          }>
          {renderDependent(dependent, removeDependent)}
          {renderIndependent(independent, removeIndependent)}
        </div>
        <div>
          <Button
            onClick={ () => runCore() }>
            Run Core
          </Button>
          <Button
            onClick={ () => runBootstrap() }>
            Run Bootstrap
          </Button>
          <Button
            onClick={ () => runRolling() }>
            Run Rolling
          </Button>
        </div>
      </div>
    );
  }
  return null;
};
