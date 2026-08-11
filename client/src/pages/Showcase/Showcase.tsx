import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { Container } from '../../components/layout/Container/Container';
import { Section } from '../../components/layout/Section/Section';
import { GlassCard } from '../../components/common/GlassCard/GlassCard';
import { Button } from '../../components/common/Button/Button';
import { Badge } from '../../components/common/Badge/Badge';
import { Modal } from '../../components/common/Modal/Modal';
import './Showcase.css';

/**
 * Temporary design-system verification shell — not the final Landing Page.
 * Exists only to confirm tokens, layout primitives, and common components
 * render correctly together before real page work begins.
 */
export function Showcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageLayout>
      <Container>
        <Section>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <p className="text-body">
            Body text styled with --font-size-base and --color-neutral-300.
          </p>
          <p className="text-label">Label text</p>
          <p className="text-caption">Caption text</p>
        </Section>

        <Section>
          <GlassCard>
            <h3>GlassCard example</h3>
            <p className="text-body">
              This card uses the glass surface tokens defined in variables.css.
            </p>
            <Badge variant="achievement">Achievement</Badge>
          </GlassCard>
        </Section>

        <Section>
          <div className="showcase-button-row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
          </div>
        </Section>

        <Section>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Modal example"
          >
            <p className="text-body">
              This modal uses the glass surface tokens and closes on backdrop
              click or Escape.
            </p>
          </Modal>
        </Section>
      </Container>
    </PageLayout>
  );
}
