import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { Landing } from '../../pages/Landing/Landing';
import { Showcase } from '../../pages/Showcase/Showcase';
import { Login } from '../../features/auth/pages/Login/Login';
import { Register } from '../../features/auth/pages/Register/Register';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute/ProtectedRoute';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage/DashboardPage';
import { ProfilePage } from '../../features/profile/pages/ProfilePage/ProfilePage';
import { WorkoutsPage } from '../../features/workouts/pages/WorkoutsPage/WorkoutsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path={ROUTES.SHOWCASE} element={<Showcase />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.WORKOUTS} element={<WorkoutsPage />} />
      </Route>
    </Routes>
  );
}
