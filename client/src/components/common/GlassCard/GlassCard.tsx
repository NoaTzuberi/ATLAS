import type { HTMLAttributes, ReactNode } from 'react';
import './GlassCard.css';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ className, children, ...rest }: GlassCardProps) {
  const classNames = ['glass-card', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}
