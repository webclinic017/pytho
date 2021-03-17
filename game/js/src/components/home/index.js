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

const HomeImage = (props) => {
  const WrapperStyle = {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
  };

  const HomeImagePathStyle = {
    fill: 'var(--img-background-color)',
  };

  return (
    <div
      style={ WrapperStyle }>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320">
        <path
          style={ HomeImagePathStyle }
          fillOpacity="1"
          // eslint-disable-next-line
          d="M0,288L40,250.7C80,213,160,139,240,90.7C320,43,400,21,480,26.7C560,32,640,64,720,85.3C800,107,880,117,960,106.7C1040,96,1120,64,1200,42.7C1280,21,1360,11,1400,5.3L1440,0L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
        </path>
      </svg>
    </div>
  );
};

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
      <HomeImage />
      <div
        className="pure-g"
        style={ HomeContentWrapperStyle }>
        <HomeTitle />
        <HomeLinkWrapperStyle
          className="pure-u-1-2">
          <Link
            to='/portfoliosimulator'>
            <span>
              Portfolio simulator
            </span>
          </Link>
        </HomeLinkWrapperStyle>
        <HomeLinkWrapperStyle
          className="pure-u-1-2">
          <Link
            to='/portfolioshare'>
            <span>
              Portfolio Share
            </span>
          </Link>
        </HomeLinkWrapperStyle>
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

