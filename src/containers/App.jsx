/**
 * @file Client app root.
 */

import styles from '@/containers/App.pcss';
import Footer from '@/components/Footer';
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
      <div className={styles.root}>
        <Header/>
        {renderRoutes(this.props.route.routes)}
        <Footer/>
      </div>
    );
  }
}
