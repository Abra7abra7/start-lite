'use client';

import localFont from 'next/font/local'
import { CartProvider } from "@/components/CartProvider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import './globals.css'
import { usePathname } from 'next/navigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith('/admin');

  return (
    <html lang="sk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            {showHeader && <Header />}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            {/* TODO: Remove this comment later */}
          </div>
          <SonnerToaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  )
}
