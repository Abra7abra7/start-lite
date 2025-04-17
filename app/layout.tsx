import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { CartProvider } from "@/components/CartProvider";
import { LayoutClientWrapper } from '@/components/LayoutClientWrapper'; 
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
  metadataBase: new URL('https://www.vinoputec.sk'), 
  title: {
    default: 'Víno Pútec - Kvalitné vína priamo od vinára', 
    template: '%s | Víno Pútec', 
  },
  description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec. Nakupujte online s doručením až k vám domov.', 
  openGraph: {
    title: 'Víno Pútec - Kvalitné vína priamo od vinára',
    description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec.',
    url: 'https://www.vinoputec.sk', 
    siteName: 'Víno Pútec',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Víno Pútec - Kvalitné vína priamo od vinára',
    description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec.',
    images: ['/og-image.png'], 
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="sk">
      <head>
        <link 
          rel="preload" 
          href="/Titulná fotka (1).jpg" 
          as="image" 
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap" 
          media="print" 
          // @ts-expect-error - onLoad nie je štandardný React prop pre link, ale funguje
          onLoad="this.media='all'"
        />
        <noscript>
          <link 
            rel="stylesheet" 
            href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap" 
          />
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
