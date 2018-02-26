/**
 * @file Route definitions for React router.
 */

import App from '@/containers/App';
import About from '@/containers/About';
import Home from '@/containers/Home';
import List from '@/containers/List';
import NotFound from '@/containers/NotFound';

export default [{
  component: App,
  routes: [{
    path: `/`,
    exact: true,
    component: Home
  }, {
    path: `/about`,
    component: About
  }, {
    path: `/list`,
    component: List
  }, {
    path: `*`,
    component: NotFound
  }]
}];
