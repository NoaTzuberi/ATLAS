import { Link } from 'react-router-dom';
import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import { ROUTES } from '../../../../app/config/routes';
import './CTA.css';

export function CTA() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section className="cta">
      <Container>
        <div className="cta-content" ref={revealRef}>
          <h2>Ready to build your strength?</h2>
          <p className="text-body">Join ATLAS and get a training plan that actually adapts to you.</p>
          <Link to={ROUTES.REGISTER} className="btn btn-primary">
            <span className="btn-label">Get Started</span>
          </Link>
          <p className="cta-login">
            Already have an account? <Link to={ROUTES.LOGIN}>Log in</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
