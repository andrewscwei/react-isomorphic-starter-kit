import styles from '@/containers/Home.pcss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

@translate()
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles[`root`]}>
        <summary>
          <h1 className={styles[`h1`]}>{t(`hello`)}</h1>
          <p className={styles[`description`]}>{t(`description`)}</p>
        </summary>
      </div>
    );
  }
}
