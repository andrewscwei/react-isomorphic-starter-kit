/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React, { PureComponent } from 'react';
import { renderRoutes } from 'react-router-config';
import styled, { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

interface Props {
  route: any;
}

export default class App extends PureComponent<Props> {
  render() {
    return (
      <StyledRoot>
        <Header/>
        {renderRoutes(this.props.route.routes)}
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
