import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
    <Sidebar />
    <main style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>
      {children}
    </main>
  </div>
);

export default Layout;
