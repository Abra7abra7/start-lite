'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react'; 
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
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger, 
    SheetClose 
} from "@/components/ui/sheet";
import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger, 
    navigationMenuTriggerStyle, 
} from "@/components/ui/navigation-menu"; 
import { CircleUser, ShoppingCart, Minus, Plus, Trash2, Menu } from 'lucide-react'; 
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; 
 
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
 
                <nav className="hidden md:flex flex-1 items-center space-x-1 text-sm font-medium ml-6"> 
                    {/* --- Desktop Navigácia --- */}
                    <NavigationMenu>
                        <NavigationMenuList>
                            {/* O Nás */}
                            <NavigationMenuItem>
                                <Link href="/o-nas" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        O Nás
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
 
                            {/* Vína - Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Vína</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[200px] lg:w-[250px]">
                                        <ListItem href="/produkty" title="Všetky vína">
                                            Zobraziť celú ponuku.
                                        </ListItem>
                                        <ListItem href="/produkty?category=biele" title="Biele vína">
                                            Svieže a elegantné.
                                        </ListItem>
                                        <ListItem href="/produkty?category=cervene" title="Červené vína">
                                            Plné a zamatové.
                                        </ListItem>
                                        <ListItem href="/produkty?category=ruzove" title="Ružové vína">
                                            Ľahké a ovocné.
                                        </ListItem>
                                        <ListItem href="/produkty?category=sumive" title="Šumivé vína">
                                            Oslavné bublinky.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
 
                            {/* Ostatné linky */}
                            <NavigationMenuItem>
                                <Link href="/penzion" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Ubytovanie
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/degustacie" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Degustácie
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/kontakt" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Kontakt
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
 
                        </NavigationMenuList>
                    </NavigationMenu>
 
                    {/* Pôvodné linky nahradené NavigationMenu vyššie */}
                    {/* 
                        O Nás
                    </Link>
                    <Link href="/produkty" className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-2">
                        Vína
                    </Link>
                    <Link href="/penzion" className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-2">
                        Ubytovanie
                    </Link>
                    <Link href="/degustacie" className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-2">
                        Degustácie
                    </Link>
                    <Link href="/kontakt" className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-2">
                        Kontakt
                    </Link>
                    */}
                </nav>
 
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Otvoriť menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Link href="/" className="flex items-center space-x-2">
                                            <Image 
                                                src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/logo/logoputec-removebg-preview.png" 
                                                alt="Víno Pútec Logo"
                                                width={24} 
                                                height={24}
                                                className="h-6 w-6" 
                                            />
                                            <span className="font-bold">Víno Pútec</span>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <Separator className="my-4"/>
                                <nav className="flex flex-col space-y-3">
                                    <SheetClose asChild> 
                                        <Link href="/o-nas" className="text-muted-foreground hover:text-foreground">
                                            O Nás
                                        </Link>
                                    </SheetClose>
 
                                    {/* Vína Kategórie v Mobile Menu */}
                                    <p className="font-semibold pt-2 pb-1">Vína</p> 
                                    <SheetClose asChild>
                                        <Link href="/produkty" className="pl-4 text-muted-foreground hover:text-foreground text-sm">
                                            › Všetky vína
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/produkty?category=biele" className="pl-4 text-muted-foreground hover:text-foreground text-sm">
                                            › Biele vína
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/produkty?category=cervene" className="pl-4 text-muted-foreground hover:text-foreground text-sm">
                                            › Červené vína
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/produkty?category=ruzove" className="pl-4 text-muted-foreground hover:text-foreground text-sm">
                                            › Ružové vína
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/produkty?category=sumive" className="pl-4 text-muted-foreground hover:text-foreground text-sm">
                                            › Šumivé vína
                                        </Link>
                                    </SheetClose>
 
                                    {/* Pôvodný link na Vína nahradený */}
                                    {/* <SheetClose asChild>
                                        <Link href="/produkty" className="text-muted-foreground hover:text-foreground">
                                            Vína
                                        </Link>
                                    </SheetClose> */}
                                    <SheetClose asChild>
                                        <Link href="/penzion" className="text-muted-foreground hover:text-foreground">
                                            Ubytovanie
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/degustacie" className="text-muted-foreground hover:text-foreground">
                                            Degustácie
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/kontakt" className="text-muted-foreground hover:text-foreground">
                                            Kontakt
                                        </Link>
                                    </SheetClose>
                                    {user ? (
                                        <SheetClose asChild>
                                            <Link href="/profil" className="text-muted-foreground hover:text-foreground">
                                                Môj profil
                                            </Link>
                                        </SheetClose>
                                    ) : (
                                        <SheetClose asChild>
                                            <Link href="/prihlasenie" className="text-muted-foreground hover:text-foreground">
                                                Prihlásiť sa
                                            </Link>
                                        </SheetClose>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
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
 
const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    }
)
ListItem.displayName = "ListItem"
