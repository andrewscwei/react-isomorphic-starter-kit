/**
 * @file Client app root.
 */

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled, { createGlobalStyle } from 'styled-components'
import Footer from '../components/Footer'
import Header from '../components/Header'
import routesConf from '../routes.conf'
import { AppState } from '../store'
import { changeLocale, I18nState } from '../store/i18n'
import globalStyles from '../styles/global'
import debug from '../utils/debug'
import { getLocaleFromPath } from '../utils/i18n'

type StateProps = {
  i18n: I18nState
}

type DispatchProps = {
  changeLocale: typeof changeLocale
}

type Props = StateProps & DispatchProps & {
  route: RouteComponentProps
}

class App extends PureComponent<Props> {
  private unlistenHistory?: () => any = undefined

  constructor(props: Props) {
    super(props)

    this.syncLocaleWithUrl(this.props.route.location.pathname)

    debug('Initializing...', 'OK')
  }

  componentDidMount() {
    this.unlistenHistory = this.props.route.history.listen(location => this.syncLocaleWithUrl(location.pathname))
  }

  componentWillUnmount() {
    this.unlistenHistory?.()
  }

  render() {
    const { route } = this.props

    return (
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
    )
  }

  private syncLocaleWithUrl(url: string) {
    const { route, changeLocale, i18n } = this.props
    const newLocale = getLocaleFromPath(url)

    if (newLocale === i18n.locale) {
      debug(`Syncing locale with URL path "${route.location.pathname}"...`, 'SKIPPED')
      return
    }

    debug(`Syncing locale with URL path "${route.location.pathname}"...`, 'OK')

    changeLocale(newLocale)
  }

  private generateRoutes() {
    return routesConf.map((route, index) => (
      <Route exact={route.exact} path={route.path} key={`route-${index}`} component={route.component}/>
    ))
  }
}

export default connect((state: AppState): StateProps => ({
  i18n: state.i18n,
}), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
  changeLocale,
}, dispatch))(App)

const GlobalStyles = createGlobalStyle`${globalStyles}`

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
`
