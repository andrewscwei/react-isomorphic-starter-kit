import { AppState } from '@/client';
import { fetchUsers, User } from '@/store/users';
import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch, Store } from 'redux';
import styled from 'styled-components';

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

  & h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  & span {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    text-align: center;
  }
`;

const mapStateToProps = (state: AppState): StateProps => ({ t: state.intl.translations, users: state.users.items });
const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({ fetchUsers }, dispatch);

interface StateProps {
  t: TranslationData;
  users: ReadonlyArray<User>;
}

interface DispatchProps {
  fetchUsers(): void;
}

interface OwnProps {

}

class About extends PureComponent<StateProps & DispatchProps & OwnProps> {
  static fetchData(store: Store<AppState>) {
    return store.dispatch(fetchUsers() as any); // TODO: Fix this
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <Helmet>
          <title>{t[`about`]}</title>
        </Helmet>
        <h1>{t[`about-title`]}</h1>
        {
          this.props.users.map((user: User) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
