import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import {routesName} from 'src/constants/routes';
import DashboardLayout from 'src/layouts/dashboard';
import {AdminStorage} from 'src/storages/admins_storage';

export const IndexPage = lazy(() => import('src/pages/app'));
export const GamePage = lazy(() => import('src/pages/game'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ResetPassWordPage = lazy(() => import('src/pages/reset-password'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const VotingPage = lazy(() => import('src/pages/voting'));
export const JobOfferPage = lazy(() => import('src/pages/job-offer'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const CreateAdminPage = lazy(() => import('src/pages/createAdmin'));
export const CreateActualityPage = lazy(() => import('src/pages/create-actuality'));



// ----------------------------------------------------------------------


export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <ProtectRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectRoute>
      ),
      // action: () {

      // },
      children: [
        { element: <IndexPage />, index: true },
        { path: routesName.user, element: <UserPage /> },
        { path: routesName.partners, element: <JobOfferPage /> },
        { path: routesName.campagnes, element: <VotingPage /> },
        { path: routesName.users, element: <VotingPage /> },
        { path: routesName.games, element: <GamePage /> },
        { path: routesName.createAdmin, element: <CreateAdminPage /> },
        { path: routesName.detailFormation, element: <ProductsPage /> },
        { path: routesName.createFormation, element: <CreateActualityPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'reset-password',
      element: <ResetPassWordPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

const ProtectRoute = ({children}) => {
  const isVerify = AdminStorage.verifyAdminLogged();
  if (isVerify) {
    return children;
  }
  return <Navigate to='/login' replace />
  
}

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
