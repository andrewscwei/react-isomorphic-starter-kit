/**
 * @file Route definitions for React router.
 */

import App from '../client/App';
import Home from '../client/pages/Home';
import List from '../client/pages/List';
import NotFound from '../client/pages/NotFound';
import ListToUsers from '../client/pages/ListToUsers';

export default [{
  component: App,
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
