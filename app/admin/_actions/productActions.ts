'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// Typ pre zjednodušený produkt pre select
export type ProductSelectItem = {
  id: number;
  name: string;
};

/**
 * Načíta zjednodušený zoznam produktov (id, name) pre použitie v Select komponente.
 */
export async function getProductsForSelect(): Promise<{ data: ProductSelectItem[] | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
    return { data: null, error: 'Chyba pri overovaní session.' };
  }

  if (!session) {
    return { data: null, error: 'Používateľ nie je prihlásený.' };
  }

  // TODO: Kontrola admin role (prípadne inej potrebnej role)

  // Načítanie ID a názvu produktov, zoradené podľa názvu
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products for select:', error);
    // Skontroluj RLS pre tabuľku products, ak existuje!
    return { data: null, error: 'Nepodarilo sa načítať zoznam produktov.' };
  }

  // Supabase typovanie môže byť nepresné, pretypujeme pre istotu
  const productsData: ProductSelectItem[] = data || [];

  return { data: productsData, error: null };
}
