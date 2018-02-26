import styles from '@/components/Header.css';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';

@translate([`common`])
export default class Header extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <header className={styles.root}>
        <button className={styles.button} onClick={() => i18n.changeLanguage(`en`)}>{t(`en`)}</button>
        <button className={styles.button} onClick={() => i18n.changeLanguage(`jp`)}>{t(`jp`)}</button>
      </header>
    );
  }
}