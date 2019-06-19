import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';

interface StateProps {
  ltxt: I18nState['ltxt'];
}

interface DispatchProps {
}

interface OwnProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {}

export default function withPageTitle(locKey: string) {
  return (WrappedComponent: typeof Component) => {
    class WithPageTitle extends PureComponent<Props> {
      constructor(props: Props) {
        super(props);
        if (typeof document !== 'undefined') document.title = this.props.ltxt(locKey);
      }

      render() {
        return (
          <WrappedComponent {...this.props}/>
        );
      }
    }

    return connect((state: AppState): StateProps => ({
      ltxt: state.i18n.ltxt,
    }), (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

    }, dispatch),
    )(hoistNonReactStatics(WithPageTitle, WrappedComponent));
  };
}
