// app/objednavka/dakujeme/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
// TODO: Import funkcie na načítanie detailov objednávky zo Supabase
// import { getOrderDetails } from '@/app/actions/orderActions'; 

interface OrderDetails {
    id: string;
    // Pridať ďalšie polia podľa potreby (napr. total_price, status, items...)
    first_name?: string;
    last_name?: string;
    created_at?: string;
}

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    useEffect(() => {
        // Ak máme orderId (z dobierky alebo Stripe success URL), skúsime načítať detaily
        if (orderId) {
            console.log(`Načítavam detaily pre objednávku ID: ${orderId}`);
            setLoading(true);
            // TODO: Implementovať a zavolať funkciu na načítanie detailov objednávky
            // getOrderDetails(orderId)
            //   .then(details => {
            //     if (details) {
            //       setOrderDetails(details);
            //     } else {
            //       setError('Objednávka nebola nájdená.');
            //     }
            //   })
            //   .catch(err => {
            //     console.error("Chyba pri načítaní objednávky:", err);
            //     setError('Nepodarilo sa načítať detaily objednávky.');
            //   })
            //   .finally(() => setLoading(false));
            
            // Dočasné riešenie bez volania DB:
            setTimeout(() => {
                 setOrderDetails({ id: orderId, first_name: 'Dočasné', last_name: 'Meno' });
                 setLoading(false);
            }, 500);
        } else if (sessionId) {
             // Ak máme len session_id (užívateľ mohol zavrieť okno pred presmerovaním z úspešnej Stripe platby)
             // V tomto prípade nemáme priamo orderId, spoliehame sa na webhook
             console.log(`Platba spracovaná (Stripe Session ID: ${sessionId}). Detaily budú dostupné čoskoro.`);
             // Môžeme zobraziť všeobecnú správu
             setLoading(false);
             // Prípadne by sme mohli mať endpoint, ktorý z session_id získa orderId, ale to je zložitejšie
        } else {
            // Ak nemáme ani orderId ani sessionId, niečo je zle
            setError('Chýbajú informácie o objednávke.');
            setLoading(false);
        }
    }, [orderId, sessionId]);

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Ďakujeme za Vašu objednávku!</CardTitle>
                    {orderId && !loading && orderDetails && (
                         <CardDescription className="text-lg pt-2">
                             Vaša objednávka č. <strong>{orderId}</strong> bola úspešne prijatá.
                         </CardDescription>
                    )}
                    {sessionId && !orderId && !loading && (
                        <CardDescription className="text-lg pt-2">
                            Vaša platba bola úspešne spracovaná. Čoskoro obdržíte potvrdenie emailom.
                         </CardDescription>
                    )}
                     {error && (
                        <CardDescription className="text-lg pt-2 text-red-600">
                            Nastala chyba: {error}
                         </CardDescription>
                    )}
                     {loading && (
                        <CardDescription className="text-lg pt-2">
                            Načítavam detaily objednávky...
                         </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    {/* TODO: Zobraziť viac detailov objednávky, ak sú načítané */}                  
                    <p className="text-muted-foreground">
                        Potvrdenie objednávky sme Vám zaslali na Vašu emailovú adresu.
                        V prípade akýchkoľvek otázok nás neváhajte kontaktovať.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild variant="outline">
                            <Link href="/produkty">Pokračovať v nákupe</Link>
                        </Button>
                        {/* TODO: Odkaz na detail objednávky pre prihláseného používateľa? */} 
                        {/* {orderDetails && (
                            <Button asChild>
                                <Link href={`/ucet/objednavky/${orderId}`}>Zobraziť objednávku</Link>
                            </Button>
                        )} */} 
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
