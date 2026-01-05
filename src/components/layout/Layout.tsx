import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showMascot?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bamboo-pattern">
      <Navbar />
      <main className="flex-1 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
