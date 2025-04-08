import React from 'react';
// Odstránenie nepoužitého importu Link
// import Link from 'next/link'; 
// TODO: Pridať ikony pre sociálne siete, ak budú potrebné (napr. z lucide-react)
// import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted text-muted-foreground mt-16 border-t">
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
                {/* Copyright */}
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-sm">
                        &copy; {currentYear} Víno Pútec. Všetky práva vyhradené.
                    </p>
                    {/* TODO: Odkaz na obchodné podmienky, ochranu osobných údajov */}
                    {/* <div className="mt-2 space-x-4">
                        <Link href="/obchodne-podmienky" className="text-xs hover:text-foreground">Obchodné podmienky</Link>
                        <Link href="/ochrana-osobnych-udajov" className="text-xs hover:text-foreground">Ochrana osobných údajov</Link>
                    </div> */} 
                </div>

                {/* TODO: Odkazy na sociálne siete */}
                {/* <div className="flex space-x-4">
                    <Link href="#" aria-label="Facebook" className="hover:text-foreground">
                        <Facebook className="h-5 w-5" />
                    </Link>
                    <Link href="#" aria-label="Instagram" className="hover:text-foreground">
                        <Instagram className="h-5 w-5" />
                    </Link>
                </div> */} 
            </div>
        </footer>
    );
}
