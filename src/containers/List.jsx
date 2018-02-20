
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUsers } from '../reducers/users';

function mapStateToProps(state) {
  return {
    users: state.users.items
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUsers }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class List extends Component {
  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    return (
      <div>
        {
          this.props.users.map(user => {
            return (
              <div key={user.id} >
                <span>{user.name}</span>
              </div>
            );
          })
        }
      </div>
    );
  }
}

List.propTypes = {
  users: PropTypes.array,
  fetchUsers: PropTypes.func
};