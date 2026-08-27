import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import { Section } from '../../../../components/layout/Section/Section';
import { Container } from '../../../../components/layout/Container/Container';
import './Features.css';

const features = [
  {
    title: 'AI Coach',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 4L19 12L27 15L19 18L16 26L13 18L5 15L13 12L16 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Smart Tracking',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 24V16M12 24V9M19 24V14M26 24V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Multi Sport',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 5V16L23 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Exercise Intelligence',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="13" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="24" y="13" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Features() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section className="features">
      <Container>
        <p className="features-label">What&apos;s included</p>
        <div className="features-strip" ref={revealRef}>
          {features.map((feature) => (
            <div className="features-item" key={feature.title}>
              <span className="features-item-icon">{feature.icon}</span>
              <span className="features-item-label">{feature.title}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
