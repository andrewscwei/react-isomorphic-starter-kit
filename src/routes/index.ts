/**
 * @file Route definitions for React router.
 */

import About from '@/containers/About';
import Home from '@/containers/Home';
import NotFound from '@/containers/NotFound';

export default [{
  path: `/`,
  exact: true,
  component: Home,
}, {
  path: `/about`,
  component: About,
}, {
  path: `/ja`,
  component: Home,
}, {
  path: `/ja/about`,
  component: About,
}, {
  path: `*`,
  component: NotFound,
}];