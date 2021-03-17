import React from 'react';
import {
  Link,
} from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  max-width: 910px;
  margin: 0 auto;
`;

const Menu = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--default-background-color);
  padding: 10px 20px;
  z-index: 100;
  opacity: 1;
  height: 90vh;
  border-left: 1px solid var(--off-background-color);

  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  ul {
    padding: 20px 10px; 
  }

  li {
    list-style-type: none;
    padding: 10px 0;
    font-size: 1.1rem;
  }
`;

export const SideMenu = ({
  showMenu, toggleMenu,
}) => {
  if (showMenu) {
    return (
      <Wrapper>
        <Menu
          onClick={ () => toggleMenu(!showMenu) }>
          <ul>
            <li>
              <Link
                to='/portfoliosimulator'>
                Portfolio Simulator
              </Link>
            </li>
            <li>
              <Link
                to='/portfolioshare'>
                Portfolio Share
              </Link>
            </li>
            <li>
              <Link
                to='/exposureanalysis'>
                Exposure Analysis
              </Link>
            </li>
            <li>
              <Link
                to='/backtest'>
                Backtest
              </Link>
            </li>
          </ul>
        </Menu>
      </Wrapper>
    );
  } else {
    return null;
  }
};
