/**
 * @file Client app root.
 */

import React, { Fragment, PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import routes, { getLocaleFromPath } from '../routes/client';
import { AppState } from '../store';
import { changeLocale } from '../store/i18n';
import globalStyles from '../styles/global';
import theme from '../styles/theme';

const debug = require('debug')('app');

interface StateProps {
  locale: string;
}

interface DispatchProps {
  changeLocale(locale: string): void;
}

interface OwnProps {
  route: RouteComponentProps<any>;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {}

class App extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.syncLocaleWithUrl();

    debug('Initializing...', 'OK');
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if ((prevProps.locale !== this.props.locale) || (prevProps.route.location.pathname !== this.props.route.location.pathname)) {
      this.syncLocaleWithUrl();
    }
  }

  syncLocaleWithUrl = () => {
    const { route, changeLocale, locale } = this.props;
    const newLocale = getLocaleFromPath(route.location.pathname);

    if (newLocale === locale) {
      debug(`Syncing locale with URL path "${route.location.pathname}"...`, 'SKIPPED');
      return;
    }

    changeLocale(newLocale);
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
        <Fragment>
          <GlobalStyles/>
          <Header/>
          <StyledBody>
            <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </StyledBody>
          <Footer/>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default hot(connect((state: AppState): StateProps => ({
    locale: state.i18n.locale,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App));

const GlobalStyles = createGlobalStyle<any>`
  ${globalStyles}
`;

const StyledBody = styled(TransitionGroup)<any>`
  height: 100%;
  position: absolute;
  width: 100%;

  .fade-enter {
    opacity: 0;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: all .3s;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
    transition: all .3s;
  }
`;
