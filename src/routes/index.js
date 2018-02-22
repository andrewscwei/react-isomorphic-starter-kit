/**
 * @file Route definitions for React router.
 */

import App from '../containers/App';
import Home from '../containers/home/Home';
import List from '../containers/List';
import NotFound from '../containers/NotFound';
import ListToUsers from '../containers/ListToUsers';

export default [{
  component: App,
  routes: [{
    path: `/`,
    exact: true,
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
