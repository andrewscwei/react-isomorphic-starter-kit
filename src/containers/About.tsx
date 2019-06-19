import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch, Store } from 'redux';
import styled from 'styled-components';
import withPageTitle from '../decorators/withPageTitle';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';
import { fetchUsers, User } from '../store/users';

interface StateProps {
  ltxt: I18nState['ltxt'];
  users: ReadonlyArray<User>;
}

interface DispatchProps {
  fetchUsers(): void;
}

interface OwnProps {

}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class About extends PureComponent<Props, State> {
  static fetchData(store: Store<AppState>) {
    return store.dispatch(fetchUsers() as any); // TODO: Fix this
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { ltxt, users } = this.props;

    return (
      <StyledRoot>
        <h1>{ltxt('about-title')}</h1>
        {
          users.map((user: User) => {
            return (
              <div key={user.id} >
                <span>{user.name}</span>
              </div>
            );
          })
        }
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    ltxt: state.i18n.ltxt,
    users: state.users.items,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(withPageTitle('about')(About));

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.font};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  span {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    text-align: center;
  }
`;
