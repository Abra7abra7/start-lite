'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Chyba pri odhlasovaní:', error);
    // Môžeš zvážiť zobrazenie chyby používateľovi
    // redirect('/prihlasenie?error=logout_failed'); // Príklad presmerovania s chybou
    // Alebo jednoducho nespraviť nič a nechať ho na aktuálnej stránke
    return; // Zastavíme vykonávanie tu, ak nastala chyba
  }

  // Po úspešnom odhlásení presmerujeme na hlavnú stránku alebo prihlasovaciu stránku
  // Použijeme /prihlasenie podľa konvencie lokalizácie
  redirect('/prihlasenie');
}
