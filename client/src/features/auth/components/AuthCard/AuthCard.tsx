import type { ReactNode } from 'react';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <GlassCard className="auth-card">
      <h1 className="auth-card-title">{title}</h1>
      {children}
    </GlassCard>
  );
}
