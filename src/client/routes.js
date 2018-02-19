
import App from './App';
import Home from './pages/Home';
// import List from './pages/List';
// import NotFound from './pages/NotFound';
// import ListToUsers from './pages/ListToUsers';

const routes = [{
  component: App,
  routes: [{
    path: `/`,
    exact: true,
    component: Home
  // }, {
  //   path: `*`,
  //   component: NotFound
  }]
}];

export default routes;