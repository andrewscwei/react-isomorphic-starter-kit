import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import withPageTitle from '../decorators/withPageTitle';
import { fetchUsers } from '../store/users';

@connect(
  (state) => ({
    i18n: state.i18n,
    users: state.users,
  }),
  (dispatch) => bindActionCreators({
    fetchUsers,
  }, dispatch),
)
@withPageTitle('about')
export default class About extends PureComponent {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    fetchUsers: PropTypes.func.isRequired,
  };

  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { i18n, users } = this.props;

    return (
      <StyledRoot>
        <h1>{i18n.ltxt('about-title')}</h1>
        {
          users.items.map((user) => {
            return (
              <div key={user.id} >
                <span>{user.first_name} {user.last_name}</span>
              </div>
            );
          })
        }
      </StyledRoot>
    );
  }
}

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.fonts.body};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.colors.title};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  span {
    color: ${props => props.theme.colors.text};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    text-align: center;
  }
`;
