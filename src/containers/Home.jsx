import styles from '@/containers/Home.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

@translate([`common`])
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.root}>
        <h1 className={styles.h1}>{t(`title`)}</h1>
      </div>
    );
  }
}
