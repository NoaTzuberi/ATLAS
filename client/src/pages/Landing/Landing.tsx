import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { AIExplanation } from './components/AIExplanation/AIExplanation';
import { CTA } from './components/CTA/CTA';
import './Landing.css';

export function Landing() {
  return (
    <PageLayout>
      <Hero />
      <Features />
      <AIExplanation />
      <CTA />
    </PageLayout>
  );
}
