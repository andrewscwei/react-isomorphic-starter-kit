import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

export default ConnectedIntlProvider;
