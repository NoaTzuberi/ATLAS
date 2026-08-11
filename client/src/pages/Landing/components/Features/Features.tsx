import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import './Features.css';

const placeholderFeatures = [1, 2, 3];

export function Features() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section className="features">
      <Container>
        <div className="features-grid" ref={revealRef}>
          {placeholderFeatures.map((index) => (
            <GlassCard key={index}>
              <h3>[Feature title]</h3>
              <p className="text-body">[Feature description]</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
