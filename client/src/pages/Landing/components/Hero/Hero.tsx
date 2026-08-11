import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { Button } from '../../../../components/common/Button/Button';
import './Hero.css';

export function Hero() {
  return (
    <Section className="hero">
      <Container>
        <h1>[Hero headline]</h1>
        <p className="text-body">[Hero supporting text]</p>
        <Button variant="primary">Start Training</Button>
      </Container>
    </Section>
  );
}
