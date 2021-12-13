import React from 'react';
import styled from 'styled-components';
import {
  Link,
} from 'react-router-dom';

const HomeLinkWrapperStyle = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--alt-background-color);
  padding: 0.5rem 1rem;
  margin: 0.5rem 1rem;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: var(--alt-background-color);
  }

  a {
     text-decoration: none;
    color: inherit;
  }
`;

const HomeTitle = (props) => {
  const HomeContentTitleStyle = {
    padding: '0 10px',
    fontSize: '1.4rem',
  };
  return (
    <div
      className="pure-u-1-1">
      <div
        style={ HomeContentTitleStyle }>
        <h2>
          Tools for individual investors
        </h2>
      </div>
    </div>
  );
};

export const Home = (props) => {
  const HomeBodyWrapperStyle = {
    height: '90vh',
  };

  const HomeContentWrapperStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    zIndex: '99',
    position: 'relative',
  };

  return (
    <div
      style={ HomeBodyWrapperStyle }>
      <div
        className="pure-g"
        style={ HomeContentWrapperStyle }>
        <HomeTitle />
        <HomeLinkWrapperStyle
          className="pure-u-1-2">
          <Link
            to='/exposureanalysis'>
            <span>
              Exposure analysis
            </span>
          </Link>
        </HomeLinkWrapperStyle>
        <HomeLinkWrapperStyle
          className="pure-u-1-2">
          <Link
            to='/backtest'>
            <span>
              Backtest
            </span>
          </Link>
        </HomeLinkWrapperStyle>
      </div>
    </div>
  );
};

