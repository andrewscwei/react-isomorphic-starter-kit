/**
 * @file Client app root.
 */

import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import routes from '../routes/client';
import { changeLocale } from '../store/i18n';
import globalStyles from '../styles/global';
import * as theme from '../styles/theme';
import debug from '../utils/debug';
import { getLocaleFromPath } from '../utils/i18n';

class App extends PureComponent {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    changeLocale: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
  };

  unlistenHistory = undefined;

  constructor(props) {
    super(props);

    this.syncLocaleWithUrl(this.props.route.location.pathname);

    debug('Initializing...', 'OK');
  }

  componentDidMount() {
    this.unlistenHistory = this.props.route.history.listen((location) => this.syncLocaleWithUrl(location.pathname));
  }

  componentWillUnmount() {
    this.unlistenHistory?.();
  }

  render() {
    const { route } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyles/>
          <Header/>
          <StyledBody>
            <CSSTransition key={route.location.key} timeout={300} classNames='route-transition'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </StyledBody>
          <Footer/>
        </Fragment>
      </ThemeProvider>
    );
  }

  syncLocaleWithUrl(url) {
    const { route, changeLocale, i18n } = this.props;
    const newLocale = getLocaleFromPath(url);

    if (newLocale === i18n.locale) {
      debug(`Syncing locale with URL path "${route.location.pathname}"...`, 'SKIPPED');
      return;
    }

    debug(`Syncing locale with URL path "${route.location.pathname}"...`, 'OK');

    changeLocale(newLocale);
  }

  generateRoutes() {
    return routes.map((route, index) => (
      <Route exact={route.exact} path={route.path} key={`route-${index}`} component={route.component}/>
    ));
  }
}

export default hot(connect(
  (state) => ({
    i18n: state.i18n,
  }),
  (dispatch) => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App));

const GlobalStyles = createGlobalStyle`
  ${globalStyles}
`;

const StyledBody = styled(TransitionGroup)`
  height: 100%;
  position: absolute;
  width: 100%;

  .route-transition-enter {
    opacity: 0;
  }

  .route-transition-enter.route-transition-enter-active {
    opacity: 1;
    transition: all .3s;
  }

  .route-transition-exit {
    opacity: 1;
  }

  .route-transition-exit.route-transition-exit-active {
    opacity: 0;
    transition: all .3s;
  }
`;
