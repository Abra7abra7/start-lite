// Nepoužívame "use server" pre túto stránku, bude statická

import dynamic from 'next/dynamic';

// Import nových sekcií
import { HeroSection } from '@/components/landing/HeroSection';

// Dynamically import sections below the fold
const AboutSection = dynamic(() => 
  import('@/components/landing/AboutSection').then((mod) => mod.AboutSection)
);
const ServicesSection = dynamic(() => 
  import('@/components/landing/ServicesSection').then((mod) => mod.ServicesSection)
);
const ContactSnippetSection = dynamic(() => 
  import('@/components/landing/ContactSnippetSection').then((mod) => mod.ContactSnippetSection)
);

export default function Home() {
  return (
    // Hlavný kontajner stránky
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSnippetSection />
      {/* Tu môžeme neskôr pridať ďalšie sekcie, napr. Odporúčané produkty */}
    </div>
  );
}
