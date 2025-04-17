import { Metadata } from 'next';
import KontaktPageClient from '@/components/kontakt/KontaktPageClient'; // Import klientskej časti

// Metadáta pre stránku Kontakt
export const metadata: Metadata = {
  title: 'Kontakt | Víno Pútec - Vinosady',
  description: 'Kontaktujte nás alebo navštívte naše vinárstvo Víno Pútec vo Vinosadoch. Nájdete tu adresu, telefónne číslo, e-mail a otváracie hodiny.',
};

// Toto je teraz Server Component
export default function KontaktPage() {
  return (
    // Renderujeme klientsky komponent, ktorý obsahuje zvyšok UI
    <KontaktPageClient />
  );
}
