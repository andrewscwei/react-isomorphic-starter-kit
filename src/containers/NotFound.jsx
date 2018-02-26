import styles from '@/containers/NotFound.css';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Route } from 'react-router-dom';

@translate()
export default class NotFound extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <Route render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = 404;
        }
        return (
          <div className={styles[`root`]}>
            <summary>
              <h1 className={styles[`h1`]}>{t(`not-found`)}</h1>
            </summary>
          </div>
        );
      }}/>
    );
  }
}