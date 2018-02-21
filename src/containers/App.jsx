/**
 * @file Client app container.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

export default class App extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>{renderRoutes(this.props.route.routes)}</div>
    );
  }
}
