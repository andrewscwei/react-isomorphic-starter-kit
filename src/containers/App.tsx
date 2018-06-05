/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import routes from '@/routes';
import { TranslationData } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

interface Props {
  locale: string;
  route: RouteComponentProps<any>;
  t: TranslationData;
}

const mapStateToProps = (state: any): Partial<Props> => ({ t: state.intl.translations, locale: state.intl.locale });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({}, dispatch);

class App extends PureComponent<Props> {
  generateRoutes = () => {
    return routes.map((route, index) => {
      const { exact, path, component } = route;
      return <Route exact={exact} path={path} component={component} key={index}/>;
    });
  }

  render() {
    const { locale, route, t } = this.props;

    return (
      <StyledRoot>
        <Header locale={locale} t={t}/>
        <TransitionGroup>
          <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
            <Switch location={route.location}>{this.generateRoutes()}</Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer t={t}/>
      </StyledRoot>
    );
  }
}

export default connect<{}, {}, Partial<Props>>(mapStateToProps, mapDispatchToProps)(App);

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
