import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import selectUsers from '../selectors/selectUsers'
import { AppState } from '../store'
import { fetchUsers, User, UsersState } from '../store/users'
import { I18nComponentProps, useLtxt, withI18n } from '../utils/i18n'

type StateProps = {
  users: UsersState
}

type DispatchProps = {
  fetchUsers: typeof fetchUsers
}

type Props = StateProps & DispatchProps & I18nComponentProps

function About({ fetchUsers, users }: Props) {
  const ltxt = useLtxt()

  useEffect(() => {
    if (typeof document !== 'undefined') document.title = ltxt('window-title-about')
    fetchUsers()
  }, [])

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

export default connect(
  (state: AppState): StateProps => ({
    users: selectUsers(state),
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(withI18n(About))

const StyledRoot = styled.div`
  ${props => props.theme.layout.hp}
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
