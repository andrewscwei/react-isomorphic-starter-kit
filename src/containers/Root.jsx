/**
 * @file Client app container.
 */

import React, { PureComponent } from 'react';
import { renderRoutes } from 'react-router-config';

export default class App extends PureComponent {
  render() {
    return (
      <div>{renderRoutes(this.props.route.routes)}</div>
    );
  }
}
