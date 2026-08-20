import { Routes, Route, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { ROUTES, EXERCISE_DETAIL_PATH } from '../config/routes';
import { Landing } from '../../pages/Landing/Landing';
import { Showcase } from '../../pages/Showcase/Showcase';
import { Login } from '../../features/auth/pages/Login/Login';
import { Register } from '../../features/auth/pages/Register/Register';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute/ProtectedRoute';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage/DashboardPage';
import { ProfilePage } from '../../features/profile/pages/ProfilePage/ProfilePage';
import { WorkoutsPage } from '../../features/workouts/pages/WorkoutsPage/WorkoutsPage';
import { OnboardingPage } from '../../features/onboarding/pages/OnboardingPage/OnboardingPage';
import { ExerciseLibraryPage } from '../../features/exercises/pages/ExerciseLibraryPage/ExerciseLibraryPage';
import { ExerciseDetailPage } from '../../features/exercises/pages/ExerciseDetailPage/ExerciseDetailPage';

export function AppRouter() {
  const location = useLocation();
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)
    ?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.SHOWCASE} element={<Showcase />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.WORKOUTS} element={<WorkoutsPage />} />
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route path={ROUTES.EXERCISES} element={<ExerciseLibraryPage />} />
          {!backgroundLocation && (
            <Route path={EXERCISE_DETAIL_PATH} element={<ExerciseDetailPage />} />
          )}
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path={EXERCISE_DETAIL_PATH} element={<ExerciseDetailPage />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
