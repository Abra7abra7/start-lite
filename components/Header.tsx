// Pridané 'use client'
'use client';

import Link from 'next/link';
import Image from 'next/image';
// Importujeme klienta pre browser
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
// Importujeme existujúcu logout akciu
import { logout } from '@/app/(auth)/actions';
import { CartIcon } from './CartIcon';
import { UserCircle2 } from 'lucide-react';
// Importujeme React hooky
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Komponent musí byť 'use client', nemôže byť async
export function Header() {
    // Stav na uloženie informácií o používateľovi
    const [user, setUser] = useState<User | null>(null);
    // Stav na sledovanie načítania
    const [loading, setLoading] = useState(true);

    // Načítanie používateľa na strane klienta
    useEffect(() => {
        const supabase = createClient();
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
            setLoading(false);
        };
        getUser();

        // Sledovanie zmien stavu prihlásenia
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
           setUser(session?.user ?? null);
           // V prípade potreby aktualizujeme loading, aj keď tu už by mal byť false
           if (loading) setLoading(false);
        });

        // Cleanup listener pri odmontovaní komponentu
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [loading]); // Spustíme efekt iba raz na začiatku (a pri zmene loading)

    // Zobrazenie počas načítavania (voliteľné)
     if (loading) {
         // Môžeme zobraziť jednoduchý skeleton alebo len časť headeru
         return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center max-w-screen-2xl justify-between">
                    {/* Logo časť */}
                     <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Image 
                            src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/logo/logoputec-removebg-preview.png" 
                            alt="Víno Pútec Logo"
                            width={32} 
                            height={32}
                            className="h-8 w-8" 
                        />
                        <span className="font-bold sm:inline-block">
                            Víno Pútec
                        </span>
                    </Link>
                    {/* Placeholder pre ikony vpravo */}
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div> {/* User icon placeholder */}
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div> {/* Cart icon placeholder */}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center max-w-screen-2xl">
                {/* TODO: Replace with actual logo */}
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Image 
                        src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/logo/logoputec-removebg-preview.png" 
                        alt="Víno Pútec Logo"
                        width={32} // Smaller logo for header
                        height={32}
                        className="h-8 w-8" // Tailwind classes for size
                    />
                    <span className="font-bold sm:inline-block">
                        Víno Pútec
                    </span>
                </Link>

                <nav className="flex flex-1 items-center justify-end space-x-4">
                    {/* TODO: Add main navigation links (Products, About, etc.) later */}

                    {user ? (
                        <div className="flex items-center gap-4">
                             <span className="text-sm hidden sm:inline-block">Ahoj, {user.email}!</span>
                            {/* Použitie importovanej logout akcie */}
                            <form action={logout}>
                                <Button variant="outline" size="sm">Odhlásiť sa</Button>
                            </form>
                        </div>
                    ) : (
                        // Show Profile Icon Link when logged out
                        <Link href="/prihlasenie" passHref>
                            <Button variant="ghost" size="icon" aria-label="Prihlásiť sa">
                                <UserCircle2 className="h-6 w-6" />
                            </Button>
                        </Link>
                    )}

                    {/* Cart Icon - Always visible */}
                    <CartIcon />

                </nav>
            </div>
        </header>
    );
}
