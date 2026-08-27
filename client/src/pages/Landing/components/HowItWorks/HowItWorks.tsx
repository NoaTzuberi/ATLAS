import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import './HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Onboard',
    description:
      'Tell ATLAS about yourself — goals, experience level, equipment access, and any limitations. This becomes the baseline everything else builds on.',
  },
  {
    number: '02',
    title: 'Move',
    description:
      'Log a workout or let ATLAS track it automatically. Every rep, set, and rest period gets recorded against the exercise library.',
  },
  {
    number: '03',
    title: 'Understand',
    description:
      'ATLAS maps what you did against your muscle activation, form, and load history — turning raw reps into a picture of how your body actually moves.',
  },
  {
    number: '04',
    title: 'Adapt',
    description:
      'Your next session updates based on that picture — progression, exercise swaps, and recovery all shift automatically as you train.',
  },
];

export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = gsap.utils.toArray<HTMLElement>('.step-card', grid);

    const animation = gsap.fromTo(
      cards,
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
    <Section className="how-it-works">
      <Container>
        <h2 className="how-it-works-heading">How ATLAS works</h2>
        <div className="how-it-works-grid" ref={gridRef}>
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-card-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p className="text-body">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
