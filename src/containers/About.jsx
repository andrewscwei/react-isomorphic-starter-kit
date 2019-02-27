import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { fetchUsers } from '../store/users';

class About extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    fetchUsers: PropTypes.func.isRequired,
  };

  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t, users } = this.props;

    return (
      <StyledRoot>
        <Helmet>
          <title>{t['about']}</title>
        </Helmet>
        <h1>{t['about-title']}</h1>
        {
          users.map((user) => {
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
  (state) => ({
    t: state.intl.translations,
    users: state.users.items,
  }),
  (dispatch) => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(About);

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
