import { AppState } from '@/store';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';

const StyledRoot = styled.figure`
  animation: rotate 5s linear infinite;
  height: 100%;
  margin: 0;
  padding: 0;
  transform-origin: center;

  & > svg {
    height: 100%;
    width: auto;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  className?: string;
}

interface Props extends StateProps, DispatchProps, OwnProps {}

const mapStateToProps = (state: AppState): StateProps => ({

});

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

}, dispatch);

class ReactLogo extends PureComponent<Props> {
  render() {
    const { className } = this.props;

    return (
      <StyledRoot className={className} dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/react-logo.svg`) }}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactLogo);
