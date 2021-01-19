import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  PlusIcon,
} from '@Common';
import {
  FormWrapper,
  FormInput,
  FormLabel,
} from '@Components/form';

export const PortfolioShareInput = (props) => {
  const [
    security, setSecurity,
  ] = useState('');
  const [
    allocation, setAllocation,
  ] = useState('');

  const inputSubmit = (e) => {
    e.preventDefault();
    if (security == '' || allocation == '') {
      return;
    }

    props.addSecurity({
      security,
      allocation,
    });
    setSecurity('');
    setAllocation('');
  };

  const inputChange = (e) => {
    e.preventDefault();
    const {
      value, name,
    } = e.target;
    if (name == 'security') {
      setSecurity(value);
    }
    if (name == 'allocation') {
      setAllocation(value);
    }
  };

  return (
    <FormWrapper
      id="portfolioshare-input">
      <FormLabel>
        Input security:
        <FormInput
          type="text"
          aria-label="security-input"
          name={ 'security' }
          value={ security }
          onChange={ inputChange } />
      </FormLabel>
      <FormLabel>
        Input weight:
        <FormInput
          type="text"
          aria-label="weight-input"
          name={ 'allocation' }
          value={ allocation }
          onChange={ inputChange } />
      </FormLabel>
      <Button
        data-testid="portfolioshare-add"
        type={ 'icon' }
        onClick={ inputSubmit }>
        <PlusIcon />
      </Button>
      <div>
        Can input portfolio as £ or % amounts
      </div>
    </FormWrapper>
  );
};

PortfolioShareInput.propTypes = {
  addSecurity: PropTypes.func.isRequired,
};
