import type { Metadata } from 'next';
import localFont from 'next/font/local'
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
  // !!! NAHRAĎ 'https://www.tvojadomena.sk' SKUTOČNOU DOMÉNOU PROJEKTU !!!
  metadataBase: new URL('https://www.tvojadomena.sk'), 
  title: {
    default: 'Víno Pútec - Kvalitné vína priamo od vinára', // Predvolený titulok
    template: '%s | Víno Pútec', // Šablóna pre titulky podstránok (napr. 'Rosé 2023 | Víno Pútec')
  },
  description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec. Nakupujte online s doručením až k vám domov.', // Predvolený popis
  // Odporúčame pridať aj Open Graph a Twitter card tagy pre lepšie zdieľanie
  openGraph: {
    title: 'Víno Pútec - Kvalitné vína priamo od vinára',
    description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec.',
    url: 'https://www.tvojadomena.sk', // !!! Znova nahraď skutočnou doménou !!!
    siteName: 'Víno Pútec',
    // Príklad obrázku pre zdieľanie (umiestniť do /public adresára)
    // images: [
    //   {
    //     url: '/og-image.png', 
    //     width: 1200,
    //     height: 630,
    //     alt: 'Víno Pútec - Logo alebo propagačný obrázok',
    //   },
    // ],
    locale: 'sk_SK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Víno Pútec - Kvalitné vína priamo od vinára',
    description: 'Objavte širokú ponuku kvalitných vín z našej rodinnej vinice Pútec.',
    // Príklad obrázku pre Twitter (môže byť rovnaký ako OG)
    // images: ['/twitter-image.png'],
  },
  // Ikonky pre prehliadače a zariadenia (favicon)
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // Verification for search consoles can be added here too
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="sk">
      <head>
        {/* Preload hero image for LCP optimization */}
        <link 
          rel="preload" 
          href="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/foto%20web/hero%20(2).webp" 
          as="image" 
          fetchPriority="high"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          {/* Použitie klientského wrapperu na obaľovanie obsahu a zobrazenie Header/Footer/Toaster */}
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
