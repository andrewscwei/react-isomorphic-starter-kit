/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import routes from '@/routes';
import { changeLocale } from '@/store/intl';
import theme from '@/styles/theme';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal, ThemeProvider } from 'styled-components';
import normalize from 'styled-normalize';

injectGlobal`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  html,
  body {
    background: ${theme.backgroundColor};
    font-family: 'Roboto', sans-serif;
    height: 100%;
    width: 100%;
  }

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

const StyledRoot = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
`;

interface Props {
  locale: string;
  locales: Array<string>;
  route: RouteComponentProps<any>;
  t: TranslationData;
  changeLocale(locale: string): void;
}

const mapStateToProps = (state: any): Partial<Props> => ({ t: state.intl.translations, locale: state.intl.locale, locales: state.intl.locales });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({ changeLocale }, dispatch);

class App extends PureComponent<Props> {
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
    const { locale, route, t } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <StyledRoot>
          <Header locale={locale} t={t}/>
          <TransitionGroup>
            <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </TransitionGroup>
          <Footer t={t}/>
        </StyledRoot>
      </ThemeProvider>
    );
  }
}

export default connect<{}, {}, Partial<Props>>(mapStateToProps, mapDispatchToProps)(App);
