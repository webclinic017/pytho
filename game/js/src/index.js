import React, {
  useState,
} from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import {
  AphroditeApp,
} from './containers/aphrodite';
import {
  AthenaApp,
} from './containers/athena';
import {
  DemeterApp,
} from './containers/demeter';
import {
  HermesApp,
} from './containers/hermes';
import {
  Home,
} from './components/home';
import {
  Header,
} from './components/header';
import {
  SideMenu,
} from './components/sidemenu';

const AppWrapper = styled.div`
  font-family: "Open Sans";
  color: var(--default-text-color);
  background-color: var(--default-background-color);
  height: 100vh;

  p {
    text-align: justify;
    font-size: 0.9rem;
    line-height: 1.75;
  }

`;

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const App = (props) => {
  const [
    showMenu, toggleMenu,
  ] = useState(false);

  return (
    <Router>
      <AppWrapper>
        <Header
          showMenu={ showMenu }
          toggleMenu={ toggleMenu } />
        <SideMenu
          toggleMenu={ toggleMenu }
          showMenu={ showMenu } />
        <Switch>
          <Route
            exact
            path="/">
            <Home />
          </Route>
          <Route
            path="/portfoliosimulator">
            <PageWrapper>
              <DemeterApp />
            </PageWrapper>
          </Route>
          <Route
            path="/portfolioshare">
            <PageWrapper>
              <HermesApp />
            </PageWrapper>
          </Route>
          <Route
            path="/exposureanalysis">
            <PageWrapper>
              <AthenaApp />
            </PageWrapper>
          </Route>
          <Route
            path="/backtest">
            <PageWrapper>
              <AphroditeApp />
            </PageWrapper>
          </Route>
        </Switch>
      </AppWrapper>
    </Router>
  );
};

import {
  render,
} from 'react-dom';

const appEl = document.getElementById('app');
render(<App />, appEl);
