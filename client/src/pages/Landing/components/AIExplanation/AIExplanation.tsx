import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import './AIExplanation.css';

export function AIExplanation() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section className="ai-explanation">
      <Container>
        <div ref={revealRef}>
          <GlassCard>
            <h2>[AI Coach heading]</h2>
            <p className="text-body">[AI Coach description]</p>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}
