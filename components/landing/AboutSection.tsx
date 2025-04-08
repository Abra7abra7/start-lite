import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image'; // Import Image

export const AboutSection = () => {
    // Nahradenie placeholderu reálnym obrázkom zo Supabase Storage
    const aboutImageUrl = "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/foto%20web/experience3.png"; 

    return (
        <section className="py-16 md:py-24 bg-background" aria-labelledby="about-title">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Textová časť */}
                    <div>
                        <h2 id="about-title" className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                            Rodinná Tradícia z Vinosadov
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Sme malé rodinné vinárstvo Víno Pútec, situované v srdci Malokarpatskej vinohradníckej oblasti, v obci Vinosady. 
                            Už po generácie sa s láskou a rešpektom k prírode venujeme pestovaniu hrozna a výrobe kvalitných vín, ktoré odrážajú jedinečný charakter nášho regiónu.
                        </p>
                        <p className="text-muted-foreground mb-8">
                            Okrem výroby vína ponúkame aj príjemné ubytovanie v našom penzióne a organizujeme degustácie pre všetkých milovníkov dobrého vína.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/o-nas">Zistiť viac o nás</Link> 
                        </Button>
                    </div>
                    
                    {/* Obrázková časť */}
                    <div className="relative h-64 md:h-auto md:min-h-[350px] rounded-lg overflow-hidden shadow-lg">
                        <Image 
                            src={aboutImageUrl}
                            alt="Fotografia vinárstva alebo rodiny Pútec"
                            fill={true} 
                            className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
