import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Import Accordion
import { MapPin, Users, Grape, Leaf, FlaskConical, Award } from 'lucide-react'; // Import icons
import { Metadata } from 'next';

// Metadáta pre stránku O nás
export const metadata: Metadata = {
  title: 'O nás | Víno Pútec - Rodinné vinárstvo Vinosady',
  description: 'Spoznajte príbeh rodinného vinárstva Víno Pútec z Vinosadov. Tradícia, vášeň pre víno a moderné technológie spojené v každej fľaši.',
  // Môžu sa pridať aj relevantné OG/Twitter tagy
};

export default function ONasPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-14 text-center">
                O Nás: Príbeh Rodinného Vína Putec
            </h1>

            {/* Úvodný obrázok */}
            <div className="mb-12 md:mb-16 relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                    // Použite URL vášho reprezentatívneho obrázka
                    src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ubytovanie/vyhlad%20na%20vinohrad-min.jpg"
                    alt="Vinohrady alebo vinárstvo Víno Pútec"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Section: Kto sme */}
            <section className="mb-12 md:mb-16">
                {/* Presunuté pozadie a padding na ďalšiu sekciu pre striedanie */}
                <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                    {/* Zjednotené odsadenie mb-8 */}
                    Kto sme a kde nás nájdete
                </h2>
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2 text-lg text-foreground/80 leading-relaxed">
                        Vitajte v Rodinnom víne Putec, vašom vinárstve v srdci
                        Malokarpatskej vinohradníckej oblasti. Nachádzame sa vo
                        Vinosadoch, malebnej obci neďaleko Pezinka, kde
                        už generácie pestujeme hrozno a s láskou tvoríme víno. Sme
                        hrdí na naše korene a tradíciu, ktorú pretavujeme do každej fľaše.
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-md">
                            <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                            <span>Srdce Malých Karpát - Vinosady</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-md">
                            <Users className="h-6 w-6 text-primary flex-shrink-0" />
                            <span>Rodinná tradícia a vášeň</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Filozofia */}
            <section className="mb-12 md:mb-16 bg-muted/40 p-6 md:p-8 rounded-lg shadow-sm">
                {/* Pridané pozadie a padding pre striedanie */}
                <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                    {/* Zjednotené odsadenie mb-8 */}
                    Naša Filozofia - Ako tvoríme víno
                </h2>
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                    <p>
                        Našou filozofiou je spojiť osvedčené, generáciami preverené postupy s výhodami modernej vinárskej technológie. Kladieme veľký dôraz na ekologický prístup, pretože veríme, že len tak môžeme naplno vyjadriť jedinečný charakter terroir Vinosadov.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-6 pt-4">
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                            <Grape className="h-10 w-10 text-primary mb-3" />
                            <h4 className="font-semibold mb-1">Tradícia & Kvalita</h4>
                            <p className="text-sm text-foreground/70">Generáciami overené postupy pestovania hrozna.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                            <Leaf className="h-10 w-10 text-green-600 mb-3" />
                            <h4 className="font-semibold mb-1">Ekológia & Terroir</h4>
                            <p className="text-sm text-foreground/70">Šetrný prístup k prírode vo vinohrade aj pivnici.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                            <FlaskConical className="h-10 w-10 text-blue-600 mb-3" />
                            <h4 className="font-semibold mb-1">Moderná Technológia</h4>
                            <p className="text-sm text-foreground/70">Využitie moderných postupov pre dokonalú chuť.</p>
                        </div>
                    </div>
                    <p>
                        Cieľom Rodinného vína Putec je prinášať vám kvalitné slovenské vína s nezameniteľnou arómou a harmonickou chuťou, ktoré sú výsledkom poctivej práce a vášne pre vinárstvo.
                    </p>
                </div>
            </section>

            {/* Section: Úspechy */}
            <section className="mb-12 md:mb-16">
                {/* Presunuté pozadie a padding */}
                <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
                    {/* Zjednotené odsadenie mb-8 */}
                    Naše Úspechy - Medzinárodne Ocenená Kvalita
                </h2>
                <p className="text-lg text-foreground/80 mb-8 text-center leading-relaxed max-w-3xl mx-auto">
                    Tvrdá práca a oddanosť kvalite prinášajú ovocie v podobe
                    uznania na prestížnych domácich aj medzinárodných
                    súťažiach. Tieto ocenenia sú pre nás potvrdením, že ideme
                    správnou cestou, a zároveň záväzkom pokračovať v produkcii
                    výnimočných vín z Vinosadov.
                </p>

                <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-6 text-center">
                        <Award className="inline-block h-6 w-6 mr-2 align-middle" /> {/* Pridaná ikona */}
                        Vinalies Internationales (Francúzsko)
                    </h3>
                    <ul className="list-disc list-inside text-lg text-foreground/80 space-y-2 max-w-2xl mx-auto mb-6">
                        <li>
                            <strong>Zlatá medaila 2025 (Cannes)</strong> - Cabernet
                            Sauvignon Rosé, ročník 2024 (Najčerstvejší úspech!)
                        </li>
                        <li>
                            <strong>Zlatá medaila 2024 (Cannes)</strong> -
                            Chardonnay, ročník 2023
                        </li>
                        <li>
                            <strong>Strieborná medaila 2020 (Paríž)</strong> -
                            Muller-Thurgau, ročník 2019
                        </li>
                        <li>
                            <strong>Zlatá medaila 2018 (Paríž)</strong> - Tramín
                            červený polosladký
                        </li>
                        <li>
                            <strong>Strieborné medaily 2018, 2017, 2016 (Paríž)</strong>
                        </li>
                    </ul>
                    <p className="text-lg text-foreground/80 text-center max-w-2xl mx-auto">
                        <strong>Národný salón vín Slovenskej republiky:</strong> Naše vína pravidelne bodujú aj v tejto vrcholnej prehliadke slovenských vín.
                    </p>
                </div>

                {/* Awards Gallery */}
                <h3 className="text-xl md:text-2xl font-semibold mb-8 text-center">
                    {/* Zmenené na font-semibold, upravená farba a odsadenie mb-8 */}
                    Ukážka ocenení
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        {
                            src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ocenenia/VI-2025.png",
                            alt: "Zlatá medaila Vinalies 2025 - Cabernet Sauvignon Rosé",
                            title: "Vinalies 2025 - Zlato",
                            description: "Cabernet Sauvignon Rosé 2024"
                        },
                        {
                            src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ocenenia/VI-2024.png",
                            alt: "Zlatá medaila Vinalies 2024 - Chardonnay",
                            title: "Vinalies 2024 - Zlato",
                            description: "Chardonnay 2023"
                        },
                        {
                            src: "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/ocenenia/VI-2020.png",
                            alt: "Strieborná medaila Vinalies 2020 - Muller-Thurgau",
                            title: "Vinalies 2020 - Striebro",
                            description: "Muller-Thurgau 2019"
                        }
                    ].map((award, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <Image
                                    src={award.src}
                                    alt={award.alt}
                                    width={400} // Increased size for better visibility in cards
                                    height={566} // Adjust based on aspect ratio
                                    className="w-full h-auto object-cover"
                                />
                            </CardHeader>
                            <CardContent className="p-4 text-center">
                                <CardTitle className="text-lg mb-1">{award.title}</CardTitle>
                                <CardDescription>{award.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Sekcia: Často kladené otázky (FAQ) - O nás */}
            <section className="mb-12 md:mb-16 bg-muted/40 p-6 md:p-8 rounded-lg shadow-sm">
                {/* Pridané pozadie a padding pre striedanie a konzistenciu */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Často kladené otázky o nás</h2>
                <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                    {/* Odstránené vnútorné pozadie a padding */}
                    <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Kde presne vo Vinosadoch sídlite?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Naše vinárstvo nájdete na adrese [Doplniť presnú adresu], Vinosady. Odporúčame si pred návštevou dohodnúť termín.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Je možné vinárstvo navštíviť aj mimo organizovanej degustácie?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Návštevu vinárstva a prípadný nákup vína mimo degustácie je možné dohodnúť individuálne telefonicky alebo e-mailom.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Aké odrody hrozna pestujete?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Pestujeme tradičné malokarpatské odrody ako Veltlínske zelené, Rizling rýnsky, Frankovka modrá, ale aj medzinárodné odrody ako Chardonnay či Cabernet Sauvignon. Kompletný sortiment nájdete v sekcii Produkty.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="border-b-0">
                        <AccordionTrigger className="text-left hover:no-underline text-gray-800 dark:text-gray-200">Sú vaše vína vhodné pre vegánov?</AccordionTrigger>
                        <AccordionContent className="pt-2 text-gray-600 dark:text-gray-400">
                            Pri výrobe niektorých vín môžeme používať tradičné postupy čírenia. Pre informácie o konkrétnych vegánskych vínach nás prosím kontaktujte.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* Section: Pozvanie */}
            <section className="text-center py-10 md:py-14">
                <p className="text-lg text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Sme rodinné vinárstvo, kde sa skúsenosti, tradícia a láska k
                    vinárskemu remeslu odovzdávajú ďalej. Veríme, že naše vína
                    vám prinesú radosť a spríjemnia výnimočné okamihy.
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                    {/* Zjednotené odsadenie mb-8 */}
                    Objavte svet Rodinného vína Putec:
                </h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
                    <Button asChild size="lg">
                        <Link href="/produkty">Prezrite si naše vína</Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                        <Link href="/degustacie">Zistite viac o degustáciách</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
