import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { Button } from '../../../../components/common/Button/Button';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import './CTA.css';

export function CTA() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section className="cta">
      <Container>
        <div className="cta-content" ref={revealRef}>
          <h2>[CTA heading]</h2>
          <p className="text-body">[CTA supporting text]</p>
          <Button variant="primary">Get Started</Button>
        </div>
      </Container>
    </Section>
  );
}
