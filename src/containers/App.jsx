/**
 * @file Client app container.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

export default class App extends PureComponent {
  render() {
    return (
      <div>{renderRoutes(this.props.route.routes)}</div>
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
};