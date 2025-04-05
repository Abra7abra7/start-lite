'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function DakujemePage() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // Clear the cart only once when the component mounts after successful payment
    useEffect(() => {
        if (sessionId) {
            console.log("Platba úspešná, session ID:", sessionId, "Vymazávam košík.");
            clearCart();
            // Here you could potentially fetch order details using the session ID
            // Be cautious about doing this client-side without authentication
        }
    }, [sessionId, clearCart]); // Depend on sessionId and clearCart

    return (
        <div className="container mx-auto py-12 px-4 text-center flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-3">Ďakujeme za vašu objednávku!</h1>
            <p className="text-xl text-gray-700 mb-8">Vaša platba bola úspešne spracovaná.</p>
            {/* Optional: Display session ID or basic order info if needed */}
            {/* {sessionId && <p className="text-sm text-gray-500 mb-6">ID relácie: {sessionId}</p>} */}

            <Link href="/produkty">
                <Button size="lg">Pokračovať v nákupe</Button>
            </Link>
        </div>
    );
}
