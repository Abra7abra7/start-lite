'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; 
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AgeVerificationModal } from './AgeVerificationModal'; 

// Dynamický import pre SonnerToaster
const SonnerToaster = dynamic(
	() => import('@/components/ui/sonner').then((mod) => mod.Toaster),
	{ ssr: false } 
);

// Cesty vyžadujúce overenie veku
const PROTECTED_PATHS = ['/produkty', '/kosik', '/pokladna', '/produkt/']; 

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter(); 
	// Nezobrazuj Header a Footer pre admin rozhranie
	const showHeaderFooter = !pathname.startsWith('/admin');

	// Stav pre overenie veku
	const [isAgeVerified, setIsAgeVerified] = useState<boolean | null>(null); 
	const [showAgeModal, setShowAgeModal] = useState(false);

	useEffect(() => {
		const storedAgeVerified = sessionStorage.getItem('ageVerified');
		const isPathProtected = PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix));

		if (!isPathProtected) {
			// Na nechránených stránkach modal nezobrazujeme
			setShowAgeModal(false);
			// Stav isAgeVerified ponecháme, aby sme vedeli, či užívateľ potvrdil/odmietol v session
			return;
		}

		// Sme na chránenej stránke
		if (storedAgeVerified === 'true') {
			setIsAgeVerified(true);
			setShowAgeModal(false);
		} else {
			// Buď neoverené (null) alebo odmietnuté ('false') v sessionStorage
			setIsAgeVerified(storedAgeVerified === 'false' ? false : null); // Nastavíme stav podľa storage
			setShowAgeModal(true); // V oboch prípadoch (null alebo false) zobrazíme modal na chránenej ceste
		}

	}, [pathname]); // Odstránená závislosť na router, presmerovanie rieši handleAgeDeny

	const handleAgeConfirm = () => {
		sessionStorage.setItem('ageVerified', 'true');
		setIsAgeVerified(true);
		setShowAgeModal(false);
	};

	const handleAgeDeny = () => {
		sessionStorage.setItem('ageVerified', 'false');
		setIsAgeVerified(false);
		setShowAgeModal(false);
		// Presmerujeme preč z chránenej sekcie
		router.push('/');
	};

	// Nezobrazuj obsah chránenej stránky, kým nie je vek overený alebo kým sa nezobrazuje modal
	const shouldHideContent = PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix)) && isAgeVerified !== true && !showAgeModal;

	return (
		<>
			<div className="relative flex min-h-screen flex-col bg-background">
				{showHeaderFooter && <Header />}
				<main className="flex-1">
					{/* Skryjeme obsah chránenej stránky, kým nie je overený vek */} 
					{shouldHideContent ? null : children}
				</main>
				{showHeaderFooter && <Footer />}
			</div>
			<SonnerToaster richColors position="top-right" />
			{/* Zobrazenie modálneho okna */} 
			<AgeVerificationModal
				isOpen={showAgeModal}
				onConfirm={handleAgeConfirm}
				onDeny={handleAgeDeny}
			/>
		</>
	);
}
