'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script'; // Import pre načítanie externých skriptov
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Wifi, ParkingCircle, UtensilsCrossed, CalendarDays, Mail, Phone, ChevronLeft, ChevronRight, X, MapPin, Mountain, Grape, Castle, Building2, Waves } from 'lucide-react'; // Pridané ikony pre galériu a výlety
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Import Dialog komponentov
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Import Accordion
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

// Zoznam obrázkov pre galériu
const galleryImages = [
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/dvor%20so%20sudom-min.jpg", alt: "Dvor penziónu so sedením pri sude" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/IMG_5835-min.jpg", alt: "Penzión Víno Pútec - Obrázok 2" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/Izba%20interier-min.jpg", alt: "Penzión Víno Pútec - Interiér izby" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/kuchyna-min.jpg", alt: "Penzión Víno Pútec - Kuchyňa" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/Kupelna%202-min.jpg", alt: "Penzión Víno Pútec - Kúpeľňa" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/misa-min.jpg", alt: "Penzión Víno Pútec - Detail" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/vyhlad%20na%20vinohrad-min.jpg", alt: "Penzión Víno Pútec - Výhľad na vinohrad" },
    { src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/dvor%20s%20kostolom-min.jpg", alt: "Penzión Víno Pútec - Dvor s kostolom" },
];

export default function PenzionPageClient() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation(); // Zabráni zatvoreniu dialógu pri kliku na tlačidlo
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
        );
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation(); // Zabráni zatvoreniu dialógu pri kliku na tlačidlo
        setCurrentImageIndex((prevIndex) => 
            prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Úvodná sekcia */}
            <section className="text-center mb-16">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">Ubytovanie v Srdci Viníc</h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Zažite pokojnú atmosféru Malokarpatskej vínnej cesty v našom útulnom penzióne, ktorý je súčasťou rodinného vinárstva Víno Pútec.
                </p>
            </section>

            {/* Sekcia: O penzióne a Vybavenie */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Váš Domov vo Vinosadoch</h2>
                    <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                        Náš penzión ponúka komfortné ubytovanie v dvojlôžkových a trojlôžkových izbách s vlastnou kúpeľňou.
                        Každá izba je navrhnutá s dôrazom na pohodlie a relax. Hostia majú k dispozícii spoločenskú miestnosť s kuchynkou a možnosťou posedenia na dvore s výhľadom do viníc.
                        Ideálna poloha penziónu vám umožní ľahko preskúmať krásy okolia, či už pešo, na bicykli alebo autom.
                    </p>
                    <Card className="bg-muted/50 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-medium">Vybavenie Penziónu</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-primary" /> Vlastná kúpeľňa</div>
                            <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-primary" /> Free WiFi</div>
                            <div className="flex items-center gap-2"><ParkingCircle className="h-4 w-4 text-primary" /> Parkovanie vo dvore</div>
                            <div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-primary" /> Spoločná kuchynka</div>
                            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Vonkajšie posedenie</div>
                            {/* Prípadne ďalšie vybavenie */}
                        </CardContent>
                    </Card>
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/vyhlad%20na%20vinohrad-min.jpg"
                        alt="Výhľad na vinohrad z penziónu Víno Pútec"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            </section>

            {/* Sekcia: Možnosti výletov v okolí */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">Objavujte Okolie</h2>
                <p className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400 mb-10">Náš penzión je ideálnym východiskovým bodom na spoznávanie krás Malokarpatského regiónu. Inšpirujte sa našimi tipmi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Karta: Vínna cesta */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Grape className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Malokarpatská vínna cesta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Navštívte okolité vinárstva, ochutnajte miestne vína a spoznajte tradíciu vinohradníctva priamo v jej srdci.
                        </CardContent>
                    </Card>

                    {/* Karta: Turistika */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Mountain className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Turistika a Cykloturistika</CardTitle>
                        </CardHeader>
                        <CardContent>
                             Objavte krásy Malých Karpát po značených turistických chodníkoch a cyklotrasách vedúcich lesmi a vinohradmi.
                        </CardContent>
                    </Card>

                    {/* Karta: Hrady a Zámky */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Castle className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Hrady a Zámky</CardTitle>
                        </CardHeader>
                        <CardContent>
                            V blízkom okolí nájdete Smolenický zámok, Hrad Červený Kameň či zrúcaninu hradu Ostrý Kameň.
                        </CardContent>
                    </Card>

                    {/* Karta: Jaskyňa Driny */} 
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Waves className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Jaskyňa Driny</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Navštívte jedinú sprístupnenú jaskyňu na západnom Slovensku s unikátnou kvapľovou výzdobou.
                        </CardContent>
                    </Card>

                    {/* Karta: Mestá a Obce */} 
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Malebné Mestečká</CardTitle>
                        </CardHeader>
                        <CardContent>
                             Preskúmajte historické vinohradnícke mestečká ako Modra, Pezinok alebo Svätý Jur plné atmosféry.
                        </CardContent>
                    </Card>

                     {/* Karta: Ďalšie tipy */} 
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Ďalšie Tipy</CardTitle>
                        </CardHeader>
                        <CardContent>
                             Radi vám poradíme s plánovaním výletov a odporučíme ďalšie zaujímavé miesta podľa vašich predstáv.
                        </CardContent>
                    </Card>

                </div>
            </section>

            {/* Sekcia: Fotogaléria */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">Fotogaléria</h2>
                <div className="lg:hidden mb-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full max-w-xl mx-auto" // Centrovanie a obmedzenie šírky
                    >
                        <CarouselContent>
                            {galleryImages.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1"> {/* Malý padding okolo itemu */}
                                        <Card className="overflow-hidden">
                                            <CardContent className="flex aspect-square items-center justify-center p-0"> {/* aspect-square a p-0 */}
                                                <Image
                                                    src={image.src}
                                                    alt={image.alt}
                                                    width={500} // Šírka pre lepšie načítanie
                                                    height={500} // Výška
                                                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                    priority={index < 2} // Priorita pre prvé obrázky
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" /> {/* Posunutie šípok */} 
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                    </Carousel>
                </div>
                <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {galleryImages.map((image, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div 
                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow hover:shadow-md transition-shadow"
                                    onClick={() => openGallery(index)} // Vrátený onClick
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill // Vrátený fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" // Vrátené sizes
                                        style={{ objectFit: 'cover' }} // Vrátený style
                                        className="group-hover:scale-105 transition-transform duration-300" // Vrátený className
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <p className="text-white text-sm font-semibold">Zobraziť</p>
                                    </div>
                                </div>
                            </DialogTrigger>
                            {/* Content is rendered within the Dialog itself when open */}
                        </Dialog>
                    ))}
                </div>
                
                {/* Dialóg pre zobrazenie obrázka */}
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                    <DialogContent 
                        className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] p-2 bg-transparent border-none shadow-none flex items-center justify-center"
                        onInteractOutside={closeGallery} // Zatvorí galériu kliknutím mimo obrázka
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={galleryImages[currentImageIndex].src}
                                alt={galleryImages[currentImageIndex].alt}
                                width={1600} // Larger base width
                                height={1200} // Larger base height
                                className="object-contain max-h-[85vh] w-auto h-auto rounded-md shadow-xl"
                                sizes="90vw" // Responsive size
                            />
                            {/* Close Button */}
                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full bg-black/50 text-white hover:bg-black/75 h-8 w-8"
                                    onClick={closeGallery}
                                    aria-label="Zavrieť galériu"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </DialogClose>
                            {/* Navigation Buttons */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75 h-10 w-10"
                                onClick={goToPrevious}
                                aria-label="Predchádzajúci obrázok"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75 h-10 w-10"
                                onClick={goToNext}
                                aria-label="Nasledujúci obrázok"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </section>

            {/* Sekcia: Rezervácia a Kontakt */}
            <section id="reservation-form" className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Rezervujte si Pobyt</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-center">
                    Overte si dostupnosť a rezervujte si izbu priamo cez náš online rezervačný systém Previo.
                </p>
                {/* Rezervačný iFrame */} 
                <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white"> 
                    <iframe 
                        src="https://booking.previo.app/?hotId=782975" // POZN: Skontroluj či je hotId správne
                        scrolling="no" 
                        frameBorder="0" 
                        width="100%" 
                        height="800" // Znížená výška, môžeme ďalej doladiť
                        name="previo-booking-iframe" 
                        id="previo-booking-iframe" 
                        className="w-full block"
                    ></iframe>
                </div>
                {/* Kontaktné informácie ako alternatíva */} 
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>Ak máte otázky alebo preferujete rezerváciu telefonicky/emailom:</p>
                    <p className="mt-2">
                        <a href="tel:+421902144074" className="inline-flex items-center hover:text-primary mr-4"><Phone className="mr-1 h-4 w-4" /> +421 902 144 074</a>
                        <a href="mailto:info@vinoputec.sk?subject=Rezervácia ubytovania Penzión Pútec" className="inline-flex items-center hover:text-primary"><Mail className="mr-1 h-4 w-4" /> info@vinoputec.sk</a>
                    </p>
                </div>
            </section>

            {/* Sekcia: Často kladené otázky (FAQ) */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">Často kladené otázky</h2>
                <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
                    <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Aký je čas príchodu (check-in) a odchodu (check-out)?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Štandardný čas príchodu je od 14:00. Čas odchodu je do 10:00. V prípade potreby iných časov nás prosím kontaktujte vopred.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Je k dispozícii parkovanie?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Áno, pre našich hostí je k dispozícii bezplatné parkovanie priamo pri penzióne.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Sú povolené domáce zvieratá?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Po dohode sú povolené menšie domáce zvieratá za príplatok. Prosím, informujte nás o tom pri rezervácii.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Poskytujete raňajky?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Áno, raňajky sú zahrnuté v cene ubytovania a podávajú sa formou bufetových stolov v našej spoločenskej miestnosti. (Poznámka: Overte si, či je táto informácia aktuálna)
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5" className="border-b-0">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Je v penzióne Wi-Fi?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Áno, v celom objekte penziónu je k dispozícii bezplatné Wi-Fi pripojenie pre našich hostí.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* Sekcia: Rezervácia a Kontakt - pôvodná sekcia s Previo, ponechaná pre referenciu/prípadné obnovenie */}
            {/* ... kód pre pôvodnú sekciu ... */}

        </div>
    );
}

// Script tag pre Previo - načítava sa len na klientovi
<Script 
    src="https://booking.previo.app/iframe/"
    strategy="lazyOnload" 
/>
