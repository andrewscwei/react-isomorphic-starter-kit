import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';

export default class NotFound extends PureComponent {
  render() {
    return (
      <Route render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = 404;
        }
        return (
          <div>
            <h1>404 : Not Found</h1>
          </div>
        );
      }}/>
    );
  }
}