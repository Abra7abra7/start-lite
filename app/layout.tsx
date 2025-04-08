import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { CartProvider } from "@/components/CartProvider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Header } from "@/components/Header";
import './globals.css'

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

export const metadata: Metadata = {
  title: 'CodeGuide Starter Lite',
  description: 'Starter kit from codeguide.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            {/* TODO: Add Footer later */}
          </div>
          <SonnerToaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  )
}
