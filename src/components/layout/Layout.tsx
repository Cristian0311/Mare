import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { InstallPrompt } from '../ui/InstallPrompt';
import { FloatingHelpButton } from '../ui/FloatingHelpButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      {/* pb-24 on mobile to account for MobileNav */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pb-8 pb-24">
        {children}
      </main>
      {/* Footer also gets pb-20 on mobile to not be covered by MobileNav */}
      <div className="md:pb-0 pb-16">
        <Footer />
      </div>
      <MobileNav />
      <InstallPrompt />
      <FloatingHelpButton />
    </div>
  );
}
