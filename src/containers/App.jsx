/**
 * @file Client app container.
 */

import '@/containers/App.css';
import Header from '@/components/Header';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

export default class App extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <Header/>
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}
