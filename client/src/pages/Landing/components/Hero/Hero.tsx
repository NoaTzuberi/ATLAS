import { Link } from 'react-router-dom';
import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { ROUTES } from '../../../../app/config/routes';
import './Hero.css';

export function Hero() {
  return (
    <Section className="hero">
      <Container>
        <h1>Know your body. Build your strength.</h1>
        <p className="text-body">Personalized training, intelligent tracking, and guidance that adapts to how you move.</p>
        <Link to={ROUTES.REGISTER} className="btn btn-primary">
          <span className="btn-label">Start Training</span>
        </Link>
      </Container>
    </Section>
  );
}
