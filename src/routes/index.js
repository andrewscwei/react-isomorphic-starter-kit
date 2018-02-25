/**
 * @file Route definitions for React router.
 */

import App from '@/containers/App';
import Home from '@/containers/Home';
import List from '@/containers/List';
import NotFound from '@/containers/NotFound';
import Users from '@/containers/Users';

export default [{
  component: App,
  routes: [{
    path: `/`,
    exact: true,
    component: Home
  }, {
    path: `/users`,
    component: Users
  }, {
    path: `/list`,
    component: List
  }, {
    path: `/jp`,
    component: Home
  }, {
    path: `/jp/users`,
    component: Home
  }, {
    path: `/jp/list`,
    component: Home
  }, {
    path: `*`,
    component: NotFound
  }]
}];
