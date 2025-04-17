import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BedDouble, Wine } from 'lucide-react'; // Príklad ikon

const services = [
    {
        title: "E-shop s Vínom",
        description: "Prezrite si našu aktuálnu ponuku bielych, ružových a červených vín priamo z našej pivnice. Pohodlný nákup online s doručením až k Vám.",
        icon: ShoppingCart,
        link: "/produkty",
        cta: "Nakupujte Online"
    },
    {
        title: "Penzión Pútec",
        description: "Hľadáte oddych v tichom prostredí Malých Karpát? Náš útulný penzión ponúka komfortné ubytovanie s rodinnou atmosférou.",
        icon: BedDouble,
        link: "/penzion",
        cta: "Zobraziť Penzión"
    },
    {
        title: "Degustácie Vína",
        description: "Zažite autentickú atmosféru našej pivnice a ochutnajte výber našich najlepších vín pod vedením skúseného vinára.",
        icon: Wine,
        link: "/degustacie",
        cta: "Viac o Degustáciách"
    },
];

export const ServicesSection = () => {
    return (
        <section className="py-16 md:py-24 bg-muted/40" aria-labelledby="services-title">
            <div className="container mx-auto px-4">
                <h2 id="services-title" className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Čo Ponúkame
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Card key={service.title} className="flex flex-col">
                                <CardHeader className="items-center">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="text-center">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center text-muted-foreground flex-grow">
                                    <p>{service.description}</p>
                                </CardContent>
                                <CardFooter className="justify-center">
                                    <Button asChild>
                                        <Link href={service.link}>{service.cta}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
