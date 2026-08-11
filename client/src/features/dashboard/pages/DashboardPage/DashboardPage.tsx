import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import './DashboardPage.css';

/**
 * Placeholder — awaiting real Dashboard feature design.
 * Exists to verify the protected-route guard end-to-end.
 */
export function DashboardPage() {
  return (
    <PageLayout>
      <Container>
        <Section>
          <GlassCard>
            <h1>Dashboard</h1>
            <p className="text-body">This is a placeholder page. Real content coming in a later phase.</p>
          </GlassCard>
        </Section>
      </Container>
    </PageLayout>
  );
}
