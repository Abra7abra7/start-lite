// app/objednavka/dakujeme/page.tsx

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface OrderDetails {
    id: string;
    first_name?: string;
    last_name?: string;
    created_at?: string;
}

function ThankYouContent() {
    'use client';

    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    useEffect(() => {
        if (orderId) {
            console.log(`Načítavam detaily pre objednávku ID: ${orderId}`);
            setLoading(true);
            setTimeout(() => {
                setOrderDetails({ id: orderId, first_name: 'Dočasné', last_name: 'Meno' });
                setLoading(false);
            }, 500);
        } else if (sessionId) {
            console.log(`Platba spracovaná (Stripe Session ID: ${sessionId}). Detaily budú dostupné čoskoro.`);
            setLoading(false);
        } else {
            setError('Chýbajú informácie o objednávke.');
            setLoading(false);
        }
    }, [orderId, sessionId]);

    return (
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
                <p className="text-muted-foreground">
                    Potvrdenie objednávky sme Vám zaslali na Vašu emailovú adresu.
                    V prípade akýchkoľvek otázok nás neváhajte kontaktovať.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/produkty">Pokračovať v nákupe</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ThankYouPage() {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Suspense fallback={<LoadingState />}>
                <ThankYouContent />
            </Suspense>
        </div>
    );
}

function LoadingState() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 animate-pulse">
                </div>
                <CardTitle className="text-3xl font-bold h-10 bg-gray-200 rounded animate-pulse"></CardTitle>
                <CardDescription className="text-lg pt-2 h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="flex justify-center gap-4">
                    <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </CardContent>
        </Card>
    );
}
