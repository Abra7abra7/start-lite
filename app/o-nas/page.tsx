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

export default function ONasPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-14 text-center text-primary">
                O Nás: Príbeh Rodinného Vína Putec
            </h1>

            {/* Section: Kto sme */}
            <section className="mb-12 md:mb-16 bg-muted/40 p-6 md:p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary/90">
                    Kto sme a kde nás nájdete
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                    Vitajte v Rodinnom víne Putec, vašom vinárstve v srdci
                    Malokarpatskej vinohradníckej oblasti. Nachádzame sa vo
                    Vinosadoch, malebnej obci neďaleko Pezinka na Slovensku, kde
                    už generácie pestujeme hrozno a s láskou tvoríme víno. Sme
                    hrdí na naše korene v tomto jedinečnom regióne Malých
                    Karpát a na tradíciu, ktorú pretavujeme do každej fľaše.
                </p>
            </section>

            {/* Section: Filozofia */}
            <section className="mb-12 md:mb-16 p-6 md:p-8">
                 <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary/90">
                    Naša Filozofia - Ako tvoríme víno
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                    Našou filozofiou je spojiť osvedčené, generáciami preverené
                    postupy s výhodami modernej vinárskej technológie. Kladieme
                    veľký dôraz na ekologický prístup vo vinohrade aj v
                    pivnici, pretože veríme, že len tak môžeme naplno vyjadriť
                    jedinečný charakter terroir Vinosadov a Malých Karpát.
                    Cieľom Rodinného vína Putec je prinášať vám kvalitné
                    slovenské vína s nezameniteľnou, bohatou arómou a
                    harmonickou chuťou, ktoré sú výsledkom poctivej práce a
                    vášne pre vinárstvo.
                </p>
            </section>

            {/* Section: Úspechy */}
            <section className="mb-12 md:mb-16 bg-muted/40 p-6 md:p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-primary/90">
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
                    <h3 className="text-xl md:text-2xl font-medium mt-6 mb-4 text-center text-primary/80">
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
                <h3 className="text-xl md:text-2xl font-medium mb-6 text-center text-primary/80">
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

            {/* Section: Pozvanie */}
            <section className="text-center py-10 md:py-14">
                 <p className="text-lg text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Sme rodinné vinárstvo, kde sa skúsenosti, tradícia a láska k
                    vinárskemu remeslu odovzdávajú ďalej. Veríme, že naše vína
                    vám prinesú radosť a spríjemnia výnimočné okamihy.
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary/90">
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
