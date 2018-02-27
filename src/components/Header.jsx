import styles from '@/components/Header.css';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

@translate()
export default class Header extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <header className={styles[`root`]}>
        <Link className={styles[`link`]} to='/'>{t(`home`)}</Link>
        <Link className={styles[`link`]} to='/about'>{t(`about`)}</Link>
      </header>
    );
  }
}