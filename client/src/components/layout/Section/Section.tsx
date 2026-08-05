import type { HTMLAttributes, ReactNode } from 'react';
import './Section.css';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Section({ className, children, ...rest }: SectionProps) {
  const classNames = ['section', className].filter(Boolean).join(' ');

  return (
    <section className={classNames} {...rest}>
      {children}
    </section>
  );
}
