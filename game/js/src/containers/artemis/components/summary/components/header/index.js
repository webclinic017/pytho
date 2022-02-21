import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  DefaultHorizontalSpacer,
} from '@Style';
import {
  Title, Text,
} from '@Common';

const BigTitle = styled(Title)`
  font-size: 2rem;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
`;

const TextWithSpace = styled(Text)`
  padding: 0 0.5rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = ({
  name, code, exchange, currency,
}) => {
  return (
    <Wrapper>
      <BigTitle>
        {name}
      </BigTitle>
      <DefaultHorizontalSpacer>
        <Line>
          <TextWithSpace
            light>
            {`${code}.${exchange}`}
          </TextWithSpace>
          <TextWithSpace
            light>
            {currency}
          </TextWithSpace>
        </Line>
      </DefaultHorizontalSpacer>
    </Wrapper>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  exchange: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
};
