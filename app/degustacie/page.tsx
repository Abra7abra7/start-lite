import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { Mail, Phone } from 'lucide-react'; // Icons for contact

const degustaciePackages = [
    {
        title: 'Balík č. 1 „Malá vínna chvíľka“',
        people: '2 – 5 osôb',
        wines: '4 druhy vína',
        food: 'Malý studený záhryz',
        duration: '1,5 hodiny',
        price: '119 €',
        extra: 'Každá ďalšia začatá hodina: 30 € + fľaša vína'
    },
    {
        title: 'Balík č. 2 „Víno trochu inak“',
        people: '6 – 9 osôb',
        wines: '8 druhov vína',
        food: 'Studený záhryz',
        tour: 'Prehliadka výrobnej časti vinárstva',
        duration: '2,5 hodiny',
        price: '295,90 €',
        extra: 'Každá ďalšia začatá hodina: 30 € + fľaša vína'
    },
    {
        title: 'Balík č. 3 „Víno trochu inak Vol.2“',
        people: '10 – 15 osôb',
        wines: '8 druhov vína',
        food: 'Studený záhryz',
        tour: 'Prehliadka výrobnej časti vinárstva',
        duration: '3 hodiny',
        price: '490 €',
        extra: 'Každá ďalšia začatá hodina: 30 € + fľaša vína'
    },
];

const piknikPackage = {
    title: 'Romantika na deke',
    description: 'Piknikový košík pre 2 osoby s bohato obloženými bagetami, sladkou pochúťkou, orieškami, minerálkou, fľašou vína podľa vlastného výberu a potrebnými drobnosťami.',
    rental: 'Košík a pikniková deka na zapožičanie.',
    deposit: 'Vratná záloha 20 €',
    price: '59,90 €'
};

export default function DegustaciePage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-14 text-center text-primary">
                Degustácie a Zážitky vo Vinosadoch
            </h1>

            <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
                Objavte chute Malých Karpát priamo v našom vinárstve. Ponúkame rôzne degustačné balíky navrhnuté tak, aby vyhovovali vašim predstavám o dokonalej vínnej chvíľke.
            </p>

            {/* Degustačné balíky */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Naše Degustačné Balíky</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                {degustaciePackages.map((pkg, index) => (
                    <Card key={index} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl">{pkg.title}</CardTitle>
                            <CardDescription>{pkg.people}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="list-disc list-outside pl-5 text-muted-foreground space-y-1 mb-4">
                                <li>{pkg.wines}</li>
                                <li>{pkg.food}</li>
                                {pkg.tour && <li>{pkg.tour}</li>}
                                <li>Dĺžka: {pkg.duration}</li>
                            </ul>
                            <p className="text-sm text-muted-foreground/80">{pkg.extra}</p>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start pt-4 border-t">
                            <p className="text-2xl font-semibold text-primary mb-4">{pkg.price}</p>
                            <Button className="w-full">Objednať Balík</Button> {/* Link/Action TBD */}
                        </CardFooter>
                    </Card>
                ))}
            </div>

             {/* Piknikový kôš */}
            <Separator className="my-16" />
             <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary/90">Špeciálna Ponuka</h2>
             <Card className="max-w-2xl mx-auto mb-16 hover:shadow-lg transition-shadow duration-300">
                 <CardHeader>
                     <CardTitle className="text-xl md:text-2xl">{piknikPackage.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground mb-3">{piknikPackage.description}</p>
                     <p className="text-muted-foreground mb-3">{piknikPackage.rental}</p>
                     <p className="text-sm text-muted-foreground/80">{piknikPackage.deposit}</p>
                 </CardContent>
                 <CardFooter className="flex flex-col items-start pt-4 border-t">
                     <p className="text-2xl font-semibold text-primary mb-4">{piknikPackage.price}</p>
                     <Button className="w-full">Objednať Piknikový Kôš</Button> {/* Link/Action TBD */}
                 </CardFooter>
             </Card>

            {/* Ako objednať */}
            <Separator className="my-16" />
            <section className="text-center bg-muted/40 p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary/90">Máte záujem o degustáciu alebo piknik?</h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                    Pre rezerváciu termínu alebo viac informácií nás neváhajte kontaktovať. Radi vám pripravíme nezabudnuteľný zážitok.
                </p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Button variant="outline" asChild>
                        <a href="mailto:vino@putec.sk"> {/* TODO: Replace with actual email */}
                            <Mail className="mr-2 h-4 w-4" /> Napíšte nám
                        </a>
                    </Button>
                     <Button variant="outline" asChild>
                        <a href="tel:+4219XXXXXXXXX"> {/* TODO: Replace with actual phone */}
                            <Phone className="mr-2 h-4 w-4" /> Zavolajte nám
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
