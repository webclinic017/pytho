import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  ComponentWrapper, DefaultHorizontalSpacer,
} from '@Style';
import {
  Title, Text,
} from '@Common';
import {
  strConverter, strConverterMult,
} from '@Helpers';

const Wrapper = styled.div`
  margin: 2rem 0;
`;

const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const StatGroup = styled.div`
  margin: 0.5rem 0;
  min-width: 25%;
`;

const BigTitle = styled(Title)`
  font-size: 2rem;
`;
const Line = styled.div`
  display: flex;
  align-items: center;
`;

const SpacedLine = styled(Line)`
  justify-content: space-between;
`;

const TextWithSpace = styled(Text)`
  padding: 0 0.5rem;
`;

const ShallowText = styled(Text)`
  line-height: 1.30;
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
`;

const BasicInfo = ({
  summary,
}) => {
  return (
    <Wrapper>
      <Name>
        <BigTitle>
          {summary.name}
        </BigTitle>
        <DefaultHorizontalSpacer>
          <Line>
            <TextWithSpace
              light>
              {`${summary.code}.${summary.exchange}`}
            </TextWithSpace>
            <TextWithSpace
              light>
              {summary.currency}
            </TextWithSpace>
          </Line>
        </DefaultHorizontalSpacer>
      </Name>
      <StatsWrapper>
        <StatGroup>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Market cap
            </ShallowText>
            <ShallowText>
              {
                parseFloat(summary.market_cap).toLocaleString('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
              {' '}
              {'m'}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Shares out
            </ShallowText>
            <ShallowText>
              {
                parseFloat(summary.shares_outstanding/1000000)
                    .toLocaleString('en', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
              }
              {' '}
              {'m'}
            </ShallowText>
          </SpacedLine>
        </StatGroup>
        <StatGroup>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              GIC Sector
            </ShallowText>
            <ShallowText>
              {summary.gic_sector}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              GIC SubIndustry
            </ShallowText>
            <ShallowText>
              {summary.gic_sub_industry}
            </ShallowText>
          </SpacedLine>
        </StatGroup>
      </StatsWrapper>
      <StatsWrapper>
        <StatGroup>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              EPS Lst
            </ShallowText>
            <ShallowText>
              {strConverter(summary.eps_trail)}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              EPS Curr
            </ShallowText>
            <ShallowText>
              {strConverter(summary.eps_fwd_est)}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              P/E
            </ShallowText>
            <ShallowText>
              {strConverter(summary.pe_trail)}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Fwd P/E
            </ShallowText>
            <ShallowText>
              {strConverter(summary.fwd_pe)}
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Div Yld
            </ShallowText>
            <ShallowText>
              {strConverterMult(summary.divi_yld)}
              {' '}
              %
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Last report
            </ShallowText>
            <ShallowText>
              {summary.last_q_date}
            </ShallowText>
          </SpacedLine>
        </StatGroup>
        <StatGroup>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Insider Held
            </ShallowText>
            <ShallowText>
              {strConverter(summary.shares_insider)}
              {' '}
              %
            </ShallowText>
          </SpacedLine>
          <SpacedLine>
            <ShallowText
              light
              margin={ '0 0.5rem 0 0' }>
              Inst held
            </ShallowText>
            <ShallowText>
              {strConverter(summary.shares_inst)}
              {' '}
              %
            </ShallowText>
          </SpacedLine>
        </StatGroup>
      </StatsWrapper>
    </Wrapper>
  );
};

BasicInfo.propTypes = {
  summary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    exchange: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    market_cap: PropTypes.number.isRequired,
    shares_outstanding: PropTypes.number.isRequired,
    gic_sector: PropTypes.string.isRequired,
    gic_sub_industry: PropTypes.string.isRequired,
    eps_trail: PropTypes.number.isRequired,
    eps_fwd_est: PropTypes.number.isRequired,
    pe_trail: PropTypes.number.isRequired,
    fwd_pe: PropTypes.number.isRequired,
    divi_yld: PropTypes.number.isRequired,
    last_q_date: PropTypes.string.isRequired,
    shares_insider: PropTypes.number.isRequired,
    shares_inst: PropTypes.number.isRequired,
  }).isRequired,
};

export const Summary = (props) => {
  return (
    <ComponentWrapper>
      <BasicInfo
        { ...props } />
    </ComponentWrapper>
  );
};
