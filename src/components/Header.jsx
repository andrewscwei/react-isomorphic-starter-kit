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

    const changeLanguage = (locale) => {
      i18n.changeLanguage(locale);
    };

    return (
      <header>
        <button onClick={() => changeLanguage(`en`)}>{t(`en`)}</button>
        <button onClick={() => changeLanguage(`jp`)}>{t(`jp`)}</button>
      </header>
    );
  }
}