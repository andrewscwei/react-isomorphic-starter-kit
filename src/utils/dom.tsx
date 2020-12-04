/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createStore } from '../store';
import * as theme from '../styles/theme';

/**
 * Factory function for generating base React app markup.
 *
 * @param Component - The React component to wrap.
 *
 * @returns The JSX markup.
 */
export function markup(Component: ComponentType<{ route: RouteComponentProps }>) {
  return (
    <Provider store={createStore()}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route render={(route: RouteComponentProps) => (
            <Component route={route}/>
          )}/>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

/**
 * Mounts a React component to a DOM element.
 *
 * @param Component - The React component to mount.
 * @param elementId - The ID of the DOM element to mount the React component to.
 */
export function mount(Component: ComponentType<{ route: RouteComponentProps }>, elementId = 'app') {
  if (process.env.APP_ENV !== 'client') return;

  if (process.env.NODE_ENV === 'development') {
    render(markup(Component), document.getElementById(elementId));
  }
  else {
    hydrate(markup(Component), document.getElementById(elementId));
  }
}
