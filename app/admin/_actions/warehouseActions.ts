'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types'; 
import { Warehouse } from '@/lib/types';

export async function getWarehouses(): Promise<{ data: Warehouse[] | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Nasledujúce funkcie set a remove sú potrebné pre server actions,
        // ktoré by mohli modifikovať session (teraz to nerobíme, ale je dobré ich mať)
        // set(name: string, value: string, options: CookieOptions) {
        //   cookieStore.set({ name, value, ...options });
        // },
        // remove(name: string, options: CookieOptions) {
        //   cookieStore.delete({ name, ...options });
        // },
      },
    }
  );

  // Overenie, či je používateľ prihlásený a či má rolu admina (príklad)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    // Logovanie chyby session, ale skúsme pokračovať, ak chceme zobraziť stránku aj neprihláseným?
    // Alebo striktne vrátiť chybu:
    console.error('Session error:', sessionError);
    return { data: null, error: 'Chyba pri overovaní session.' };
  }

  if (!session) {
    return { data: null, error: 'Používateľ nie je prihlásený.' };
  }

  // Tu by mala byť kontrola role používateľa, napr.
  // const { data: userRole, error: roleError } = await supabase.rpc('get_user_role');
  // if (roleError || userRole !== 'admin') {
  //   return { data: null, error: 'Neoprávnený prístup.' };
  // }
  // Pre jednoduchosť teraz kontrolu role vynecháme, ale v produkcii je NUTNÁ!

  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching warehouses:', error);
    return { data: null, error: 'Nepodarilo sa načítať sklady.' };
  }

  return { data, error: null };
}
