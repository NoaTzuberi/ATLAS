import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import dashboardShot1 from '../../../../assets/homePage/profile.png';
import dashboardShot2 from '../../../../assets/homePage/dashboard.png';
import './DashboardPreview.css';

gsap.registerPlugin(ScrollTrigger);

export function DashboardPreview() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const frames = gsap.utils.toArray<HTMLElement>('.device-frame', grid);

    const animation = gsap.fromTo(
      frames,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          once: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <Section className="dashboard-preview">
      <Container>
        <h2 className="dashboard-preview-heading">See it in action</h2>
        <p className="dashboard-preview-subtext text-body">
          Everything you log feeds straight into your dashboard — sets, progress, and muscle activation in one
          view.
        </p>
        <div className="dashboard-preview-grid" ref={gridRef}>
          <div className="device-frame device-frame-primary">
            <div className="device-frame-bar">
              <span className="device-frame-dot" />
              <span className="device-frame-dot" />
              <span className="device-frame-dot" />
            </div>
            <img src={dashboardShot1} alt="ATLAS dashboard overview" />
          </div>
          <div className="device-frame device-frame-secondary">
            <div className="device-frame-bar">
              <span className="device-frame-dot" />
              <span className="device-frame-dot" />
              <span className="device-frame-dot" />
            </div>
            <img src={dashboardShot2} alt="ATLAS progress tracking" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
