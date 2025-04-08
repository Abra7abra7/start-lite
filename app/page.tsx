// Nepoužívame "use server" pre túto stránku, bude statická

// Import nových sekcií
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { ContactSnippetSection } from '@/components/landing/ContactSnippetSection';

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
