import { fetchUsers } from '@/store/users';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const StyledRoot = styled.div`
  padding: 10% 5%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  color: #fff;
  box-sizing: border-box;

  & summary {
    max-width: 550px;
  }

  & > h1 {
    font-size: 2.4em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin: 0;
  }

  span {
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    color: #666;
  }
`;

const mapStateToProps = state => ({ users: state.users.items });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUsers }, dispatch);

interface Props {
  t: any;
  users: any;
  fetchUsers: any;
}

class About extends Component<Props> {
  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <summary>
          <h1>{t(`about-title`)}</h1>
          {
            this.props.users.map(user => {
              return (
                <div key={user.id} >
                  <span>{user.name}</span>
                </div>
              );
            })
          }
        </summary>
      </StyledRoot>
    );
  }
}

export default translate()(connect(mapStateToProps, mapDispatchToProps)(About));
