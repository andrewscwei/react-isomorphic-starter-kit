
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUsers } from '../reducers/users';

class List extends Component {
  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    return (
      <div >
        {
          this.props.items.map(item => {
            return (
              <div key={item.id} >
                <span>{item.name}</span>
              </div>
            );
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({items: state.users.items});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUsers }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);