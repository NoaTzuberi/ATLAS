import type { ReactNode } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { usePageEnter } from '../../../hooks/usePageEnter';
import './PageLayout.css';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const mainRef = usePageEnter<HTMLElement>();

  return (
    <div className="page-layout">
      <Navbar />
      <main className="page-layout-main" ref={mainRef}>
        {children}
      </main>
    </div>
  );
}
