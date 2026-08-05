import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import HeroMuscleAnimation from '../../three/HeroMuscleAnimation';

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <div style={{ width: '100%' }}>
            {/* Hero section — MUST have an explicit height, or the 3D canvas
                collapses to 0px and you'll see a blank white/dark box */}
            <section style={{ width: '100%', height: '100vh' }}>
              <HeroMuscleAnimation />
            </section>

            {/* rest of your page goes below */}
            <section style={{ padding: '2rem' }}>
              <h1>Your content below the hero</h1>
            </section>
          </div>
        }
      />
    </Routes>
  );
}
