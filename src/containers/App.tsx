/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import routes from '@/routes';
import { AppState } from '@/store';
import { changeLocale } from '@/store/intl';
import globalStyles from '@/styles/global';
import theme from '@/styles/theme';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled, { injectGlobal, ThemeProvider } from 'styled-components';

injectGlobal`
  ${globalStyles}
`;

interface StateProps {
  locales: ReadonlyArray<string>;
}

interface DispatchProps {
  changeLocale(locale: string): void;
}

interface OwnProps {
  route: RouteComponentProps<any>;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class App extends PureComponent<Props, State> {
  componentWillMount() {
    this.updateLocale();
  }

  componentDidUpdate() {
    this.updateLocale();
  }

  updateLocale = () => {
    const { route, changeLocale, locales } = this.props;
    const locale = route.location.pathname.split('/')[1];

    if (~locales.indexOf(locale)) {
      changeLocale(locale);
    }
    else {
      changeLocale(locales[0]);
    }
  }

  generateRoutes = () => {
    return routes.map((route, index) => {
      const { exact, path, component } = route;
      return <Route exact={exact} path={path} component={component} key={index}/>;
    });
  }

  render() {
    const { route } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <StyledRoot>
          <Header/>
          <StyledBody>
            <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </StyledBody>
          <Footer/>
        </StyledRoot>
      </ThemeProvider>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    locales: state.intl.locales,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App);

const StyledRoot = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
`;

const StyledBody = styled(TransitionGroup)`
  height: 100%;
  position: absolute;
  width: 100%;
`;
