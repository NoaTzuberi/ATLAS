import type { ReactNode } from 'react';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import atlasLogo from '../../../../assets/Logo/ATLASlogo3.png';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <GlassCard className="auth-card">
      <img className="auth-card-logo" src={atlasLogo} alt="ATLAS" />
      <h1 className="auth-card-title">{title}</h1>
      {children}
    </GlassCard>
  );
}
