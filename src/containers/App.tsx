/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import routes from '@/routes';
import React, { PureComponent } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

interface Props {
  route: RouteComponentProps<any>;
}

export default class App extends PureComponent<Props> {
  generateRoutes = () => {
    return routes.map((route, index) => {
      const { exact, path, component } = route;
      return <Route exact={exact} path={path} component={component} key={index}/>;
    });
  }

  render() {
    const { route } = this.props;

    return (
      <StyledRoot>
        <Header/>
        <TransitionGroup>
          <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
            <Switch location={route.location}>{this.generateRoutes()}</Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </StyledRoot>
    );
  }
}

injectGlobal`
  ${normalize}

  html,
  body {
    font-family: 'Roboto', sans-serif;
    width: 100%;
    height: 100%;
    background: #111;
  }
`;
