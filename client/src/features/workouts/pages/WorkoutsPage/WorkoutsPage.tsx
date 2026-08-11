import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import './WorkoutsPage.css';

/**
 * Placeholder — awaiting real Workouts feature design.
 * Exists to verify the protected-route guard end-to-end.
 */
export function WorkoutsPage() {
  return (
    <PageLayout>
      <Container>
        <Section>
          <GlassCard>
            <h1>Workouts</h1>
            <p className="text-body">This is a placeholder page. Real content coming in a later phase.</p>
          </GlassCard>
        </Section>
      </Container>
    </PageLayout>
  );
}
