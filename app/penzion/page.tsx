'use client'; // Potrebné pre framer-motion

import React from 'react';
import Image from 'next/image'; // Import pre optimalizované obrázky
import Script from 'next/script'; // Import pre načítanie externých skriptov
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Predpokladám, že máte UI Card komponenty
import { motion } from 'framer-motion'; // Import pre animácie
import { Button } from "@/components/ui/button" // Import Button komponentu
// Import ikon pre vybavenie
import { Wifi, ParkingCircle, BathIcon, AirVent, Wine, Wind } from 'lucide-react';
// Import ikon pre okolie
import { Bike, MountainSnow, Castle, MapPin } from 'lucide-react'; 
// Import ikon pre typy izieb a vybavenie
import { BedDouble, BedSingle, Users, CookingPot } from 'lucide-react';
// Import Carousel komponentov
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { CheckCircle } from 'lucide-react';
// Import ikon pre kontakt
import { Phone, Mail, MapPin as AddressPin } from 'lucide-react'; 

// Zoznam obrázkov pre galériu
const galleryImages = [
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/dvor%20so%20sudom-min.jpg", alt: "Dvor penziónu so sedením pri sude" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/IMG_5835-min.jpg", alt: "Vonkajšie posedenie pri grile (detail)" }, 
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/vyhlad%20na%20vinohrad-min.jpg", alt: "Výhľad na vinohrad" }, 
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/kuchyna-min.jpg", alt: "Kuchyňa v Penzióne Pútec" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/Kupelna%202-min.jpg", alt: "Druhá kúpeľňa v Penzióne Pútec" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/misa-min.jpg", alt: "Detail vybavenia - misa" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/IMG_5835-min.jpg", alt: "Vonkajšie posedenie pri grile" }, 
    // Môžete pridať ďalšie obrázky
];

// Zoznam vybavenia
const amenities = [
    { icon: Wifi, text: 'Bezplatné Wi-Fi' },
    { icon: ParkingCircle, text: 'Parkovanie zdarma' },
    { icon: BathIcon, text: 'Súkromná kúpeľňa' },
    { icon: AirVent, text: 'Klimatizácia' },
    { icon: Wine, text: 'Možnosť degustácie' },
    { icon: Wind, text: 'Vonkajšie posedenie' }, // Použijeme Wind ako ikonu pre vonkajšie priestory
];

// Konfigurácia animácie
const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" }
    },
};

export default function PenzionPage() {
    return (
        <>
            {/* Načítanie Previo skriptu */}
            <Script 
                src="https://booking.previo.app/iframe/" 
                strategy="lazyOnload" // Načítať až keď je stránka načítaná
            />

            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Úvodná sekcia s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }} // Animácia sa spustí raz, keď je 30% sekcie viditeľných
                    variants={sectionVariants}
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
                        Vitajte v Penzione Pútec
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Užite si pokojnú atmosféru rodinného penziónu v srdci Malokarpatskej vinohradníckej oblasti, v malebnej obci Vinosady, len kúsok od Pezinka. Ideálne miesto pre relax, turistiku, cyklovýlety či firemné akcie.
                    </p>
                </motion.section>

                {/* Sekcia Okolie a Aktivity s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Objavujte Malé Karpaty</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                        <div className="flex items-start space-x-4">
                            <Bike className="h-8 w-8 text-putec-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1 text-primary/80">Cyklotrasy</h3>
                                <p className="text-sm text-muted-foreground">Množstvo značených trás pre cestné aj horské bicykle priamo od penziónu.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <MountainSnow className="h-8 w-8 text-putec-primary flex-shrink-0 mt-1" /> 
                            <div>
                                <h3 className="font-semibold mb-1 text-primary/80">Turistika</h3>
                                <p className="text-sm text-muted-foreground">Výlety na Zochovu chatu, Veľkú Homolu (s rozhľadňou) či potulky vinohradmi.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Castle className="h-8 w-8 text-putec-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1 text-primary/80">Hrady a Kultúra</h3>
                                <p className="text-sm text-muted-foreground">Navštívte Červený Kameň, Smolenický zámok alebo historické centrum Pezinka.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <MapPin className="h-8 w-8 text-putec-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1 text-primary/80">Vínna Cesta</h3>
                                <p className="text-sm text-muted-foreground">Nachádzate sa priamo na Malokarpatskej vínnej ceste plnej lokálnych vinárstiev.</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Sekcia Naše Ubytovanie s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-primary/90">Naše Ubytovanie vo Vinosadoch</h2>
                    <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10"> 
                        Ponúkame komfortné ubytovanie v Penzióne Pútec s celkovou kapacitou pre 15 osôb, ideálne pre rodinné dovolenky, partie priateľov či menšie skupiny objavujúce krásy Malých Karpát. Užite si súkromie a pohodlie v srdci vinárskeho regiónu.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Popis Izbieb */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-card dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center mb-3">
                                <BedDouble className="h-6 w-6 mr-3 text-putec-primary" />
                                <BedSingle className="h-6 w-6 mr-3 text-putec-primary" />
                                <h3 className="text-xl font-semibold text-primary/80">Typy Izbieb</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                K dispozícii máme celkovo šesť moderne zariadených izieb:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li><span className="font-medium text-gray-800 dark:text-gray-200">3x Trojlôžková izba:</span> Poskytuje priestor a pohodlie pre menšie skupiny alebo rodiny.</li>
                                <li><span className="font-medium text-gray-800 dark:text-gray-200">3x Dvojlôžková izba:</span> Ideálna pre páry alebo jednotlivcov.</li>
                            </ul>
                            <div className="flex items-center mt-4 text-sm text-muted-foreground">
                                <BathIcon className="h-4 w-4 mr-2 text-putec-primary" />
                                <span>Každá izba má vlastnú kúpeľňu (sprcha, WC).</span>
                            </div>
                             <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4 mr-2 text-putec-primary" />
                                <span>Celková kapacita: 15 lôžok.</span>
                            </div>
                        </div>

                        {/* Popis Kuchyne */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-card dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center mb-3">
                                <CookingPot className="h-6 w-6 mr-3 text-putec-primary" />
                                <h3 className="text-xl font-semibold text-primary/80">Spoločná Kuchyňa</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Všetkým našim hosťom je plne k dispozícii priestranná a moderne vybavená spoločná kuchyňa. Nájdete v nej všetko potrebné na prípravu vlastných jedál, od raňajok až po večeru, alebo len na posedenie pri káve.
                            </p>
                             <p className="text-muted-foreground mt-3 text-sm">
                                Vybavenie zahŕňa: chladničku, sporák, mikrovlnnú rúru, rýchlovarnú kanvicu, riady a jedálenský stôl.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Galéria s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-primary/90">Naše priestory</h2>
                    {/* Použitie Shadcn Carousel komponentu */}
                    <Carousel 
                        opts={{ align: "start", loop: true }} 
                        className="w-full max-w-3xl mx-auto" // Centrovanie a maximálna šírka
                    >
                        <CarouselContent>
                            {galleryImages.map((image, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3"> {/* Zobrazenie 1, 2 alebo 3 obrázkov naraz */} 
                                    <div className="p-1">
                                        <Card className="overflow-hidden">
                                            <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                                                <Image
                                                    src={image.src}
                                                    alt={image.alt}
                                                    width={500}
                                                    height={600}
                                                    className="object-cover w-full h-full"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" /> {/* Posunutie šípok mimo */} 
                        <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
                    </Carousel>
                </motion.section>

                {/* Sekcia Vybavenie s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Čo u nás nájdete</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-4xl mx-auto">
                        {amenities.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-card dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <item.icon className="h-8 w-8 mb-3 text-putec-primary dark:text-putec-primary" strokeWidth={1.5} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Sekcia Referencie s animáciou */}
                <motion.section 
                    className="mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Čo hovoria naši hostia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <blockquote className="border-l-4 border-putec-primary pl-6 italic text-gray-700 dark:text-gray-300">
                            <p className="mb-2">&quot;Úžasné miesto na oddych v srdci Malých Karpát. Krásne prostredie, výborné víno a veľmi milí majitelia. Určite odporúčame!&quot;</p>
                            <footer className="font-semibold text-sm text-gray-600 dark:text-gray-400">- Rodina Nováková</footer>
                        </blockquote>
                        <blockquote className="border-l-4 border-putec-primary pl-6 italic text-gray-700 dark:text-gray-300">
                            <p className="mb-2">&quot;Penzión Pútec je skvelá voľba pre všetkých, ktorí hľadajú pokoj a pohodu. Výborná poloha na výlety po okolí a možnosť ochutnať skvelé lokálne vína.&quot;</p>
                            <footer className="font-semibold text-sm text-gray-600 dark:text-gray-400">- Peter K.</footer>
                        </blockquote>
                        {/* Môžete pridať ďalšie referencie */}
                    </div>
                </motion.section>

                {/* Sekcia Výhody s animáciou */}
                <motion.section 
                    className="mb-10 md:mb-12 bg-gray-50 dark:bg-gray-800 py-8 px-4 rounded-lg"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={sectionVariants}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
                        <div className="flex flex-col items-center">
                            <CheckCircle className="h-7 w-7 text-green-600 mb-2" />
                            <p className="font-medium text-gray-700 dark:text-gray-300">Pokojné prostredie vinohradov</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle className="h-7 w-7 text-green-600 mb-2" />
                            <p className="font-medium text-gray-700 dark:text-gray-300">Degustácie priamo v penzióne</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle className="h-7 w-7 text-green-600 mb-2" />
                            <p className="font-medium text-gray-700 dark:text-gray-300">Ideálna poloha pre výlety</p>
                        </div>
                    </div>
                </motion.section>

                {/* Vloženie CTA Tlačidla */} 
                <div className="text-center mb-10 md:mb-12">
                    <Button 
                        size="lg" 
                        onClick={() => {
                            document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-putec-primary hover:bg-putec-primary/90 text-white dark:text-black px-8 py-3"
                    >
                        Overiť dostupnosť a rezervovať
                    </Button>
                </div>

                {/* Sekcia s rezervačným formulárom s animáciou a ID */} 
                <motion.section
                    id="reservation-form" // Pridané ID pre skrolovanie
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary/90">Rezervujte si pobyt</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground mb-6">
                                Overte si dostupnosť a rezervujte si izbu priamo cez náš online rezervačný systém.
                            </p>
                            {/* Rezervačný iFrame */}
                            <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                <iframe 
                                    src="https://booking.previo.app/?hotId=782975"
                                    scrolling="no" 
                                    frameBorder="0" 
                                    width="100%" 
                                    height="1800" // Upravená výška, môžete doladiť
                                    name="previo-booking-iframe" 
                                    id="previo-booking-iframe" 
                                    allowTransparency={true} // allowTransparency je zastarané, ale Previo ho môže vyžadovať
                                    className="w-full block" // Zaistenie plnej šírky a zobrazenia
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Sekcia Kontakt s animáciou */}
                <motion.section 
                    className="mt-12 md:mt-16 pt-10 border-t border-gray-200 dark:border-gray-700"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Máte otázky? Kontaktujte nás</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                        <div className="flex flex-col items-center">
                            <Phone className="h-7 w-7 text-putec-primary mb-3" />
                            <h3 className="font-semibold mb-1 text-primary/80">Telefón</h3>
                            <a href="tel:+421900123456" className="text-putec-primary hover:underline">+421 900 123 456</a> 
                            {/* TODO: Nahradiť správnym číslom */} 
                        </div>
                        <div className="flex flex-col items-center">
                            <Mail className="h-7 w-7 text-putec-primary mb-3" />
                            <h3 className="font-semibold mb-1 text-primary/80">Email</h3>
                            <a href="mailto:info@penzionputec.sk" className="text-putec-primary hover:underline">info@penzionputec.sk</a>
                            {/* TODO: Nahradiť správnym emailom */}
                        </div>
                        <div className="flex flex-col items-center">
                            <AddressPin className="h-7 w-7 text-putec-primary mb-3" /> 
                            <h3 className="font-semibold mb-1 text-primary/80">Adresa</h3>
                            {/* Zmena farby textu adresy */}
                            <p className="text-putec-primary dark:text-putec-primary">Pezinská 615/103</p>
                            <p className="text-putec-primary dark:text-putec-primary">902 01 Vinosady</p>
                            {/* TODO: Overiť správnosť adresy */} 
                        </div>
                    </div>
                </motion.section>

            </div>
        </>
    );
}
