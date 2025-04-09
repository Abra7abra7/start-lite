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
                                <p>Pezinská 154</p>
                                <p>902 01 Vinosady</p>
                                <p>Slovenská republika</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                            <div>
                                <h3 className="font-medium text-foreground">Telefón</h3>
                                <a href="tel:+421902144074" className="hover:text-primary">+421 902 144 074</a>
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
                    <div className="aspect-video overflow-hidden rounded-lg border border-muted">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2652.499761078169!2d17.26887437695553!3d48.31708493608637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c9ba6b517e3b7%3A0xc5d46349716a5f77!2sPezinsk%C3%A1%20154%2C%20902%2001%20Vinosady!5e0!3m2!1sen!2ssk!4v1712644752788!5m2!1sen!2ssk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa sídla Víno Pútec"
                        ></iframe>
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
