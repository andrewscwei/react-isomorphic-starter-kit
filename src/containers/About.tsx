import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Action, bindActionCreators, Dispatch, Store } from 'redux'
import styled from 'styled-components'
import { AppState } from '../store'
import { fetchUsers, User, UsersState } from '../store/users'
import { I18nComponentProps, withI18n } from '../utils/i18n'

type StateProps = {
  users: UsersState
}

type DispatchProps = {
  fetchUsers: typeof fetchUsers
}

type Props = StateProps & DispatchProps & RouteComponentProps & I18nComponentProps

class About extends PureComponent<Props> {

  static fetchData(store: Store<AppState>) {
    return store.dispatch(fetchUsers() as any)
  }

  componentDidMount() {
    if (typeof document !== 'undefined') document.title = this.props.ltxt('window-title-about')
    this.props.fetchUsers()
  }

  render() {
    const { ltxt, users } = this.props

    return (
      <StyledRoot>
        <h1>{ltxt('window-title-about-title')}</h1>
        {
          users.map((user: User) => (
            <div key={user.id}>
              <span>{user.first_name} {user.last_name}</span>
            </div>
          ))
        }
      </StyledRoot>
    )
  }
}

export default connect(
  (state: AppState): StateProps => ({
    users: state.users,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(withI18n(About))

const StyledRoot = styled.div`
  ${props => props.theme.layout.ph}
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h2}
    color: ${props => props.theme.colors.white};
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
  }

  span {
    ${props => props.theme.texts.p1}
    color: ${props => props.theme.colors.grey};
    text-align: center;
  }
`
