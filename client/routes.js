
import AppRoot from './app-root';
import Home from './pages/Home';
import List from './pages/List';
import NotFound from './pages/NotFound';
import ListToUsers from './pages/ListToUsers';

const routes = [
  { component: AppRoot,
    routes: [
      { path: '/',
        exact: true,
        component: Home
      },
      { path: '/home',
        component: Home
      },
      { path: '/list',
        component: ListToUsers
      }, {
        path: `/users`,
        component: List
      }, {
        path: `*`,
        component: NotFound
      }
    ]
  }
];

export default routes;