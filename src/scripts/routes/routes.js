import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import DetailPage from '../pages/detail/detail-page';
import NewPage from '../pages/new/new-page';
import GuestPage from '../pages/guest/guest-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/guest': () => checkUnauthenticatedRouteOnly(new GuestPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
  '/detail/:id': () => checkAuthenticatedRoute(new DetailPage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;
