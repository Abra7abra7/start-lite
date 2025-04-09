import React from 'react';
import Link from 'next/link'; 
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'; 

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted text-muted-foreground mt-16 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Mapa stránok */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-foreground mb-2">Mapa stránok</h4>
                        <nav aria-label="Mapa stránok">
                            <ul className="space-y-1">
                                <li><Link href="/" className="hover:text-primary transition-colors text-sm">Domov</Link></li>
                                <li><Link href="/produkty" className="hover:text-primary transition-colors text-sm">Produkty</Link></li>
                                <li><Link href="/o-nas" className="hover:text-primary transition-colors text-sm">O nás</Link></li>
                                <li><Link href="/degustacie" className="hover:text-primary transition-colors text-sm">Degustácie</Link></li>
                                <li><Link href="/penzion" className="hover:text-primary transition-colors text-sm">Penzión</Link></li>
                                <li><Link href="/kontakt" className="hover:text-primary transition-colors text-sm">Kontakt</Link></li>
                                <li><Link href="/kosik" className="hover:text-primary transition-colors text-sm">Košík</Link></li>
                                <li><Link href="/prihlasenie" className="hover:text-primary transition-colors text-sm">Môj účet</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Informácie */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-foreground mb-2">Informácie</h4>
                        <nav aria-label="Informácie">
                            <ul className="space-y-1">
                                <li><Link href="/obchodne-podmienky" className="hover:text-primary transition-colors text-sm">Obchodné podmienky</Link></li>
                                <li><Link href="/ochrana-osobnych-udajov" className="hover:text-primary transition-colors text-sm">Ochrana osobných údajov</Link></li>
                                <li><Link href="/reklamacny-poriadok" className="hover:text-primary transition-colors text-sm">Reklamačný poriadok</Link></li>
                                {/* TODO: Doplniť ďalšie informačné odkazy, napr. Doprava a platba */} 
                            </ul>
                        </nav>
                    </div>

                    {/* Kontakt */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-foreground mb-2">Kontaktujte nás</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>Putec s.r.o.<br />Pezinská 154,<br />902 01 Vinosady</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <a href="mailto:info@vinoputec.sk" className="hover:text-primary transition-colors">info@vinoputec.sk</a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <a href="tel:+421902144074" className="hover:text-primary transition-colors">+421 902 144 074</a>
                            </li>
                        </ul>
                    </div>

                    {/* Sociálne siete */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-foreground mb-2">Sledujte nás</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/vinoputec/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="h-6 w-6" />
                            </a>
                            <a href="https://www.facebook.com/vinoputec/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright - Spodný riadok */}
                <div className="border-t pt-8 mt-8 text-center text-sm">
                    <p>&copy; {currentYear} Víno Pútec. Všetky práva vyhradené. </p>
                    {/* Prípadne pridať odkaz na tvorcu stránky */} 
                    {/* <p className="mt-1">Vytvoril <a href="https://tvojastranka.sk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Tvoje Meno/Firma</a></p> */} 
                </div>
            </div>
        </footer>
    );
}
