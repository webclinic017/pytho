import React from 'react';
import PropTypes from 'prop-types';

import {
  PlusIcon,
  MinusIcon,
} from '@Common';

export const Accordion = (props) => {
  const [isVisible, setVisibility] = React.useState(false);

  const wrapperStyle = {
    margin: '0.5rem 0',
    backgroundColor: '#f8f8f8',
    boxShadow: '0.2rem 0.3rem #d3d3d3',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '0.5rem solid #383838',
    padding: '0.5rem 1rem 0.5rem 0.5rem',
  };

  return (
    <div
      className="pure-g"
      style={ wrapperStyle }>
      <div
        className="pure-u-5-5">
        <div
          style={ headerStyle }
          onClick={ () => setVisibility(!isVisible) }>
          {props.title}
          {isVisible ? <MinusIcon />: <PlusIcon />}
        </div>
      </div>
      {isVisible && props.children}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
