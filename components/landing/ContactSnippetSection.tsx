import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactSnippetSection = () => {
    return (
        <section className="py-16 md:py-24 bg-background" aria-labelledby="contact-snippet-title">
            <div className="container mx-auto px-4 text-center">
                <h2 id="contact-snippet-title" className="text-3xl md:text-4xl font-bold mb-8 text-primary">
                    Navštívte Nás
                </h2>
                <div className="max-w-3xl mx-auto text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="flex flex-col items-center">
                        <MapPin className="h-8 w-8 mb-2 text-primary"/>
                        <h3 className="font-semibold mb-1">Adresa</h3>
                        <p>Vinárska 123</p>
                        <p>902 01 Vinosady</p> 
                    </div>
                     <div className="flex flex-col items-center">
                        <Phone className="h-8 w-8 mb-2 text-primary"/>
                        <h3 className="font-semibold mb-1">Telefón</h3>
                        <a href="tel:+4219XXXXXXXX" className="hover:text-primary">+421 9XX XXX XXX</a>
                    </div>
                     <div className="flex flex-col items-center">
                        <Mail className="h-8 w-8 mb-2 text-primary"/>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a href="mailto:info@vinoputec.sk" className="hover:text-primary">info@vinoputec.sk</a>
                    </div>
                </div>
                
                <Button asChild size="lg">
                    <Link href="/kontakt">Zobraziť mapu a kontaktný formulár</Link>
                </Button>
            </div>
        </section>
    );
};
