import type { ReactNode } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { usePageEnter } from '../../../hooks/usePageEnter';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const mainRef = usePageEnter<HTMLElement>();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-shell-main" ref={mainRef}>
        {children}
      </main>
    </div>
  );
}
