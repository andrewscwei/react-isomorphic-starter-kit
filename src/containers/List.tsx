import React, { PureComponent } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class List extends PureComponent {
  render() {
    return (
      <Route render={({ staticContext }) => {
        return <Redirect from='/list' to='/users'/>;
      }}/>
    );
  }
}
