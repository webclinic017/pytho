import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  Title,
} from '@Common';

export const PerfRow = ({
  data, title, first, period,
}) => {
  const strConverter = (scalar) => (scalar).toPrecision(2);
  const cellStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  };

  return (
    <div
      className="pure-g">
      {
        first && (
          <>
            <Title
              light
              align="left"
              className="pure-u-8-24">
              CAGR
            </Title>
            <Title
              light
              align="left"
              className="pure-u-8-24">
              Vol
            </Title>
            <Title
              light
              align="left"
              className="pure-u-8-24">
              MDD
            </Title>
          </>
        )
      }

      <Title
        light
        align="left"
        style={
          {
            margin: '0.25rem 0',
          }
        }
        className="pure-u-24-24">
        {period != -1 ? period: ''}
        {' '}
        {title}
      </Title>
      <div
        className="pure-u-8-24">
        <span
          style={ cellStyle }>
          <Text
            number
            highlight>
            {strConverter(data['cagr'])}
          </Text>
          <Text
            light
            margin={ '0' }>
            %
          </Text>
        </span>
      </div>
      <div
        className="pure-u-8-24">
        <span
          style={ cellStyle }>
          <Text
            number
            highlight>
            {strConverter(data['vol'])}
          </Text>
          <Text
            light
            margin={ '0' }>
            %
          </Text>
        </span>
      </div>
      <div
        className="pure-u-8-24">
        <span
          style={ cellStyle }>
          <Text
            number
            highlight>
            {strConverter(data['mdd'])}
          </Text>
          <Text
            light
            margin={ '0' }>
            %
          </Text>
        </span>
      </div>
    </div>
  );
};

PerfRow.propTypes = {
  data: PropTypes.shape({
    cagr: PropTypes.number.isRequried,
    vol: PropTypes.number.isRequired,
    mdd: PropTypes.number.isRequired,
  }).isRequired,
  title: PropTypes.string,
  first: PropTypes.bool,
  period: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
};
