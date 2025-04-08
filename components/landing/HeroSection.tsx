import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const HeroSection = () => {
    // TODO: Nahradiť URL reálnym obrázkom alebo videom
    const heroImageUrl = "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/hero%20(2).webp"; 

    return (
        <section 
            className="relative flex items-center justify-center h-[70vh] min-h-[500px] bg-cover bg-center bg-no-repeat text-white" 
            style={{ backgroundImage: `url('${heroImageUrl}')` }} // Použitie inline štýlu pre obrázok na pozadí
            aria-labelledby="hero-title"
        >
            {/* Overlay pre lepšiu čitateľnosť textu */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            {/* Kontajner pre obsah, aby bol nad overlayom */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <h1 id="hero-title" className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    Rodinné Vína Pútec
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                    Objavte poctivé vína z Malých Karpát, rezervujte si pobyt v našom penzióne alebo zažite nezabudnuteľnú degustáciu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href="/produkty">Naše Vína</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <Link href="/penzion">Ubytovanie</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <Link href="/degustacie">Degustácie</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
