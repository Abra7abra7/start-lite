'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Nezobrazuj Header a Footer pre admin rozhranie
  const showHeaderFooter = !pathname.startsWith('/admin');

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-background">
        {showHeaderFooter && <Header />}
        <main className="flex-1">
          {children}
        </main>
        {showHeaderFooter && <Footer />}
      </div>
      <SonnerToaster richColors position="top-right" />
    </>
  );
}
