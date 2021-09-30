import React from 'react';
import PropTypes from 'prop-types';
import zip from 'lodash.zip';

import {
  Text,
  Title,
} from '@Common';

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '1rem 0',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  align: 'left',
  margin: '0',
  padding: '0',
};

export const PerfCountries = ({
  isFinished, data,
}) => {
  const flipped = zip(...data);
  if (isFinished) {
    return (
      <div>
        <div
          style={ sectionStyle }>
          <Title
            light
            align="left">
            Simulation countries
          </Title>
          {
            flipped.map((d, i) => (
              <p
                style={ rowStyle }
                key={ i }>
                <Text
                  style={
                    {
                      paddingLeft: '0.5rem',
                    }
                  }
                  focus
                  margin={ '' }
                  key={ i }>
                  {d[0]}
                  {' '}
                </Text>
                <Text
                  light>
                  {' '}
                  {d[1]}
                  {' '}
                  -
                  {' '}
                  {d[2]}
                </Text>
              </p>
            ))
          }

        </div>
      </div>
    );
  } else {
    return null;
  }
};

PerfCountries.propTypes = {
  isFinished: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
};
