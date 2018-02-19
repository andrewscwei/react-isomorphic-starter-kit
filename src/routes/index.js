/**
 * @file Route definitions for React router.
 */

import Root from '../containers/Root';
import Home from '../containers/Home';
import List from '../containers/List';
import NotFound from '../containers/NotFound';
import ListToUsers from '../containers/ListToUsers';

export default [{
  component: Root,
  routes: [{
    path: `/`,
    exact: true,
    component: Home
  }, {
    path: `/home`,
    component: Home
  }, {
    path: `/list`,
    component: ListToUsers
  }, {
    path: `/users`,
    component: List
  }, {
    path: `*`,
    component: NotFound
  }]
}];
