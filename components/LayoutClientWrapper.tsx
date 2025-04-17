'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Dynamický import pre SonnerToaster
const SonnerToaster = dynamic(
  () => import('@/components/ui/sonner').then((mod) => mod.Toaster),
  { ssr: false } // Toaster nemá zmysel renderovať na serveri
);

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
      <SonnerToaster richColors position="top-right" /> {/* Použitie dynamicky importovaného komponentu */}
    </>
  );
}
