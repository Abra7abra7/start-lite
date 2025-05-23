import { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter, Montserrat } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
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

// Nové Google fonty
const inter = Inter({
  subsets: ['latin', 'latin-ext'], // Pridané latin-ext pre slovenské znaky
  variable: '--font-inter',
  display: 'swap', // Zabezpečí rýchle zobrazenie textu
});

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'], // Pridané latin-ext
  variable: '--font-montserrat',
  weight: ['400', '700'], // Príklad váh, môžeme upraviť
  display: 'swap',
});

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
    <html lang="sk" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* DNS Preconnect pre externé domény */}
        <link rel="preconnect" href="https://jfmssfymrewzbnsbynxd.supabase.co" crossOrigin="anonymous" />
        
        {/* Preload kritických zdrojov s prioritou */}
        <link 
          rel="preload" 
          href="/hero-mobile.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <link 
          rel="preload" 
          href="/hero-optimized.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link rel="preload" href="./fonts/GeistVF.woff" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Optimalizácia Core Web Vitals */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#DEB584" />
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />

        {/* Prioritizácia LCP */}
        <style dangerouslySetInnerHTML={{ __html: `
          .critical-hero {
            content-visibility: auto;
            contain-intrinsic-size: auto 500px;
          }
        `}} />
      </head>
      <body className={'antialiased'}> 
        <CartProvider>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
