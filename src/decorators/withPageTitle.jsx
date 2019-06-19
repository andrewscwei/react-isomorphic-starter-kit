import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default function withPageTitle(locKey) {
  return (WrappedComponent) => {
    class WithPageTitle extends PureComponent {
      static propTypes = {
        ltxt: PropTypes.func.isRequired,
      }

      constructor(props) {
        super(props);
        if (typeof document !== 'undefined') document.title = this.props.ltxt(locKey);
      }

      render() {
        return (
          <WrappedComponent {...this.props}/>
        );
      }
    }

    return connect(state => ({
      ltxt: state.i18n.ltxt,
    }), dispatch => bindActionCreators({

    }, dispatch),
    )(hoistNonReactStatics(WithPageTitle, WrappedComponent));
  };
}
