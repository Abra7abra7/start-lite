// Súbor: app/penzion/page.tsx
// Toto je Server Component.

import { Metadata } from 'next';
import PenzionPageClient from '@/components/penzion/PenzionPageClient';

// Metadáta pre stránku Penzión
export const metadata: Metadata = {
  title: 'Penzión pri Vinárstve | Ubytovanie Víno Pútec Vinosady',
  description: 'Hľadáte ubytovanie vo Vinosadoch? Náš penzión priamo pri vinárstve Víno Pútec ponúka komfortné izby a ideálnu polohu na spoznávanie Malokarpatskej vínnej cesty.',
};

// Server Component funkcia
export default function PenzionPage() {
  // Renderuje klientský komponent, ktorý obsahuje všetku UI logiku a interaktivitu
  return <PenzionPageClient />;
}
