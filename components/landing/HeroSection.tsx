'use client'; // Označenie ako Client Component

import React, { useState, useEffect } from 'react'; // Import useState a useEffect
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// Importovanie ikon
import { Wine, BedDouble, Users } from 'lucide-react';
import { motion } from 'framer-motion'; // Import framer-motion

// Hook na detekciu šírky obrazovky
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Počiatočná kontrola na klientovi
    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);
    handler(); // Okamžitá kontrola

    // Listener pre zmeny veľkosti
    mediaQuery.addEventListener('change', handler);

    // Cleanup listenera
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export const HeroSection = () => {
    // Zistenie, či ide o mobilné zobrazenie (šírka < 768px)
    const isMobile = useMediaQuery('(max-width: 767px)'); // Používame 767px, aby to zodpovedalo < md

    // URL adresa obrázka je teraz definovaná v tailwind.config.ts
    // const heroImageUrl = "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/foto%20web/hero%20(2).webp"; 

    // Definícia animácie
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
    };

    const buttonContainerVariants = {
        hidden: { },
        visible: {
            transition: {
                staggerChildren: 0.15, // Oneskorenie medzi animáciami tlačidiel
                delayChildren: 0.3, // Začiatok animácie tlačidiel po animácii textu
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5, ease: "easeOut" } 
        },
    };

    // Podmienené definovanie animačných props
    const containerAnimationProps = !isMobile ? { initial: "hidden", animate: "visible", variants: { visible: { transition: { staggerChildren: 0.2 } } } } : {};
    const textAnimationProps = !isMobile ? { variants: textVariants } : {};
    const buttonContainerAnimationProps = !isMobile ? { variants: buttonContainerVariants } : {};
    const buttonAnimationProps = !isMobile ? { variants: buttonVariants } : {};

    return (
        <section 
            className="relative flex items-center justify-center h-[70vh] min-h-[500px] bg-cover bg-center bg-no-repeat text-white bg-hero-pattern" 
            aria-labelledby="hero-title"
        >
            {/* Overlay pre lepšiu čitateľnosť textu */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            {/* Kontajner pre obsah, aby bol nad overlayom */}
            <motion.div 
                className="relative z-10 container mx-auto px-4 text-center"
                // Aplikujeme podmienené props
                {...containerAnimationProps}
            >
                <motion.h1 
                    id="hero-title" 
                    className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                    // Aplikujeme podmienené props
                    {...textAnimationProps}
                >
                    Rodinné Vína Pútec
                </motion.h1>
                <motion.p 
                    className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md"
                    // Aplikujeme podmienené props
                    {...textAnimationProps}
                >
                    Objavte poctivé vína z Malých Karpát, rezervujte si pobyt v našom penzióne alebo zažite nezabudnuteľnú degustáciu.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    // Aplikujeme podmienené props
                    {...buttonContainerAnimationProps}
                >
                    <motion.div {...buttonAnimationProps}> {/* Aplikujeme podmienené props */}
                        <Button asChild size="lg">
                            <Link href="/produkty">
                                <Wine className="mr-2 h-5 w-5" /> Naše Vína
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div {...buttonAnimationProps}> {/* Aplikujeme podmienené props */}
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/penzion">
                                <BedDouble className="mr-2 h-5 w-5" /> Ubytovanie
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div {...buttonAnimationProps}> {/* Aplikujeme podmienené props */}
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/degustacie">
                               <Users className="mr-2 h-5 w-5" /> Degustácie
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};
