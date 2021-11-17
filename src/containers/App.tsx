/**
 * @file Client app root.
 */

import React, { Fragment, FunctionComponent } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled, { createGlobalStyle } from 'styled-components'
import Footer from '../components/Footer'
import Header from '../components/Header'
import routesConf from '../routes.conf'
import globalStyles from '../styles/global'

const App: FunctionComponent = () => {
  const location = useLocation()

  return (
    <Fragment>
      <GlobalStyles/>
      <Header/>
      <StyledBody>
        <CSSTransition key={location.key} timeout={300} classNames='route-transition'>
          <Routes>
            {routesConf.map((route, index) => (
              <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
            ))}
          </Routes>
        </CSSTransition>
      </StyledBody>
      <Footer/>
    </Fragment>
  )
}

export default App

const GlobalStyles = createGlobalStyle`
  ${globalStyles}
`

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
