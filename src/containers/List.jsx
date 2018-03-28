import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class List extends PureComponent {
  render() {
    return (
      <Route render={({ staticContext }) => {
        if (staticContext) staticContext.status = 302;
        return <Redirect from='/list' to='/users'/>;
      }}/>
    );
  }
}
