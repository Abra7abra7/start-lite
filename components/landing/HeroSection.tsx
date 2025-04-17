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

    // Definícia animácie - extrémne optimalizované pre výkon
    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.2, ease: "easeOut" }
        },
    };

    const buttonContainerVariants = {
        hidden: { },
        visible: {
            transition: {
                staggerChildren: 0.05, // Minimálne oneskorenie pre extrémny výkon
                delayChildren: 0.1, // Minimálne oneskorenie pre extrémny výkon
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.2, ease: "easeOut" } 
        },
    };

    // Úplné vypnutie animácií na mobilných zariadeniach a podmienené definovanie animačných props
    // Redukované animácie pre všetky zariadenia kvôli výkonu
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        // Kontrola, či užívateľ preferuje zníženú animáciu - len na klientskej strane
        setPrefersReducedMotion(
            typeof window !== 'undefined' && 
            window.matchMedia && 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }, []);
    
    const useAnimations = !isMobile && !prefersReducedMotion;
    const containerAnimationProps = useAnimations ? { initial: "hidden", animate: "visible", variants: { visible: { transition: { staggerChildren: 0.1 } } } } : {};
    const textAnimationProps = useAnimations ? { variants: textVariants } : {};
    const buttonContainerAnimationProps = useAnimations ? { variants: buttonContainerVariants } : {};
    const buttonAnimationProps = useAnimations ? { variants: buttonVariants } : {};

    return (
        <section 
            className="hero-section-image lcp-priority critical-hero relative flex items-center justify-center h-[70vh] min-h-[500px] bg-cover bg-center bg-no-repeat text-white bg-hero-pattern md:bg-hero-pattern-desktop" 
            aria-labelledby="hero-title"
            data-priority="true"
        >
            {/* Overlay pre lepšiu čitateľnosť textu - extrémne optimalizovaný pre výkon */}
            <div className="absolute inset-0 bg-black/50 z-0 hero-image" data-priority="high"></div>

            {/* Kontajner pre obsah, aby bol nad overlayom */}
            <motion.div 
                className="relative z-10 container mx-auto px-4 text-center optimize-paint"
                // Aplikujeme podmienené props
                {...containerAnimationProps}
            >
                <motion.h1 
                    id="hero-title" 
                    className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg optimize-paint"
                    // Aplikujeme podmienené props
                    {...textAnimationProps}
                >
                    Rodinné Vína Pútec
                </motion.h1>
                <motion.p 
                    className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md optimize-paint"
                    // Aplikujeme podmienené props
                    {...textAnimationProps}
                >
                    Objavte poctivé vína z Malých Karpát, rezervujte si pobyt v našom penzióne alebo zažite nezabudnuteľnú degustáciu.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center optimize-paint"
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
