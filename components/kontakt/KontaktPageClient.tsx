'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react'; // Pridal som Clock pre otváracie hodiny
import KontaktForm from '@/components/kontakt/KontaktForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KontaktPageClient() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-14 text-gray-900 dark:text-gray-100">Kontaktujte Nás</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
        {/* Kontaktné informácie */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Naše Vinárstvo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-base">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Putec s.r.o.</p>
                <p>Pezinská 154,</p>
                <p>902 01 Vinosady</p>
                {/* Moznost pridat link na Google Maps */}
                {/* <a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">Zobraziť na mape</a> */}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
              <a href="tel:+421902144074" className="hover:text-primary transition-colors">+421 902 144 074</a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <a href="mailto:info@vinoputec.sk" className="hover:text-primary transition-colors">info@vinoputec.sk</a>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Otváracie hodiny (predajňa):</p>
                <p>Pondelok - Piatok: 9:00 - 17:00</p>
                <p>Sobota: 9:00 - 12:00 (alebo podľa dohody)</p>
                <p>Nedeľa: Zatvorené</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontaktný formulár */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Napíšte Nám</CardTitle>
          </CardHeader>
          <CardContent>
            <KontaktForm />
          </CardContent>
        </Card>
      </div>

      {/* Sekcia s mapou */}
      <div className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Nájdete nás tu</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md border">
             <iframe
                 src="https://maps.google.com/maps?q=Vino%20Putec%20Vinosady&t=&z=15&ie=UTF8&iwloc=&output=embed"
                 width="100%"
                 height="450" // Fixná výška pre lepšiu kontrolu
                 style={{ border: 0 }}
                 allowFullScreen={false}
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Mapa - Víno Pútec Vinosady"
             ></iframe>
         </div>
      </div>
    </div>
  );
}
