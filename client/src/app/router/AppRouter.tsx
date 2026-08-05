import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { Showcase } from '../../pages/Showcase/Showcase';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Showcase />} />
    </Routes>
  );
}
