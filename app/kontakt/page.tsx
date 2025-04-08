'use client'; // Označenie ako Client Component

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import KontaktForm from '@/components/kontakt/KontaktForm'; // Import nového komponentu

export default function KontaktPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-12">Kontaktujte Nás</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Naše Údaje</h2>
                    <div className="space-y-4 text-muted-foreground mb-8">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                            <div>
                                <h3 className="font-medium text-foreground">Adresa</h3>
                                <p>Víno Pútec</p>
                                <p>Vinárska 123</p>
                                <p>902 01 Vinosady</p>
                                <p>Slovenská republika</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                            <div>
                                <h3 className="font-medium text-foreground">Telefón</h3>
                                <a href="tel:+4219XXXXXXXX" className="hover:text-primary">+421 9XX XXX XXX</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                            <div>
                                <h3 className="font-medium text-foreground">Email</h3>
                                <a href="mailto:info@vinoputec.sk" className="hover:text-primary">info@vinoputec.sk</a>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Nájdete nás tu</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Mapa bude vložená tu</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-6">Napíšte Nám</h2>
                    <KontaktForm /> 
                </div>
            </div>
        </div>
    );
}
