import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { HowItWorks } from './components/HowItWorks/HowItWorks';
import { DashboardPreview } from './components/DashboardPreview/DashboardPreview';
import { CTA } from './components/CTA/CTA';
import { VideoBackground } from './components/VideoBackground/VideoBackground';
import './Landing.css';

export function Landing() {
  return (
    <PageLayout>
      <VideoBackground />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <CTA />
    </PageLayout>
  );
}
