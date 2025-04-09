'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    HoverCard, 
    HoverCardContent, 
    HoverCardTrigger 
} from "@/components/ui/hover-card";
import { CircleUser, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'; 
import { Separator } from "@/components/ui/separator";

import { logout } from '@/app/(auth)/actions'; 
import { createClient } from '@/lib/supabase/client'; 
import { useEffect, useState } from 'react';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCart } from '@/context/CartContext'; 


export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin] = useState(false); 
    const { cartItems, getItemCount, getTotalPrice, removeItem, updateQuantity } = useCart(); 
    const totalItems = getItemCount(); 
 
    useEffect(() => {
        const supabase = createClient();
        let isMounted = true; 

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (isMounted) {
                setUser(user);
                setLoading(false);
            }
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'USER_UPDATED') {
                    setLoading(true); 
                    fetchUser(); 
                }
            }
        });

        return () => {
            isMounted = false;
            authListener?.subscription.unsubscribe();
        };
    }, []); 

    if (loading) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center max-w-screen-2xl justify-between">
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
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div> 
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div> 
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center max-w-screen-2xl">
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

                <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium ml-6"> 
                    <Link href="/o-nas" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        O Nás
                    </Link>
                    <Link href="/produkty" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Vína
                    </Link>
                    <Link href="/penzion" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Ubytovanie
                    </Link>
                    <Link href="/degustacie" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Degustácie
                    </Link>
                    <Link href="/kontakt" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Kontakt
                    </Link>
                </nav>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="md:hidden">
                        <button className="p-2 rounded-md hover:bg-muted">
                            <span className="sr-only">Menu</span> 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    {user ? (
                        <div className="hidden sm:flex items-center gap-4"> 
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <CircleUser className="h-5 w-5" />
                                        <span className="sr-only">Používateľské menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Môj účet</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profil">Môj profil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profil/objednavky">Moje objednávky</Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin">Administrácia</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="p-0">
                                        <form action={logout} className="w-full">
                                            <Button 
                                                type="submit" 
                                                variant="ghost" 
                                                className="w-full h-full justify-start px-2 py-1.5 font-normal"
                                            >
                                                Odhlásiť sa
                                            </Button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button asChild size="sm" className="hidden md:flex"> 
                            <Link href="/prihlasenie">Prihlásiť sa</Link>
                        </Button>
                    )}
                    {/* --- Minicart --- */}
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <Link href="/kosik" className="relative p-2 hover:bg-muted rounded-full">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Nákupný košík</span>
                                {/* Badge s počtom položiek */}                     
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80" align="end">
                            {/* Odstránený vonkajší flex kontajner, HoverCardContent má vlastný padding */}
                            <div className="space-y-2"> {/* Tento div teraz priamo v HoverCardContent */}
                                <h4 className="font-medium leading-none">Nákupný košík</h4>
                                <Separator className="my-1" />
                                {cartItems.length > 0 ? (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Max height and scroll, increased spacing */}
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-start justify-between text-sm gap-3"> {/* Zmena na items-start pre lepšie zarovnanie pri wrapnutí */}
                                                {/* Obrázok a Názov */}
                                                <div className="flex items-center gap-2 flex-grow min-w-0"> {/* min-w-0 pre truncating */}
                                                    <div className="relative h-10 w-10 bg-muted rounded overflow-hidden flex-shrink-0"> 
                                                        {item.image_url && (
                                                            <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="40px"/>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow min-w-0"> {/* min-w-0 pre truncating */}
                                                        <span className="block font-medium truncate">{item.name}</span>
                                                        <span className="block text-xs text-muted-foreground">€{item.price.toFixed(2)} / ks</span>
                                                    </div>
                                                </div>
                                                {/* Množstvo, Cena, Odstrániť */}
                                                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                                                    {/* Counter */}
                                                    <div className="flex items-center border rounded-md h-7"> {/* Menšia výška countera */}
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-full w-7 rounded-r-none" 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1} 
                                                            aria-label={`Znížiť množstvo ${item.name}`}
                                                        >
                                                            <Minus size={12} />
                                                        </Button>
                                                        <span className="px-2 text-xs font-medium w-8 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-full w-7 rounded-l-none" 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                                            aria-label={`Zvýšiť množstvo ${item.name}`}
                                                        >
                                                            <Plus size={12} />
                                                        </Button>
                                                    </div>
                                                    {/* Cena spolu */}
                                                    <span className="font-semibold text-xs w-[70px] text-right"> 
                                                        €{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    {/* Tlačidlo Odstrániť */}
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)} aria-label={`Odstrániť ${item.name}`}> 
                                                        <Trash2 size={14}/>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Váš košík je prázdny.</p>
                                )}
                                
                                {cartItems.length > 0 && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Celkom:</span>
                                            <span>€{getTotalPrice().toFixed(2)}</span>
                                        </div>
                                        <Button asChild className="w-full mt-2" size="sm">
                                            <Link href="/kosik">Zobraziť košík</Link>
                                        </Button>
                                    </>
                                )}
                            </div> 
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </div>
        </header>
    );
}
