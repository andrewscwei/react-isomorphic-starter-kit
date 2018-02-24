import styles from '@/containers/Home.css';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

@translate([`common`])
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.container}>
        <img src={require(`@/assets/images/logo.svg`)}/>
        <h1>{t(`hello`)}</h1>
      </div>
    );
  }
}
