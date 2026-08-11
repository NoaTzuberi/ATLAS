import type { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';
import './PageLayout.css';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <Navbar />
      <main className="page-layout-main">{children}</main>
    </div>
  );
}
