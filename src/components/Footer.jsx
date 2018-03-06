import styles from '@/components/Footer.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';

@translate()
export default class Footer extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <footer className={styles[`root`]}>
        <nav className={styles[`nav`]}>
          <a className={styles[`github-button`]} href='https://github.com/andrewscwei/react-universal-starter-kit'/>
        </nav>
        <button className={styles[`locale-button`]} onClick={() => i18n.changeLanguage(`en`)}>{t(`en`)}</button>
        <button className={styles[`locale-button`]} onClick={() => i18n.changeLanguage(`jp`)}>{t(`jp`)}</button>
      </footer>
    );
  }
}