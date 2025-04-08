// app/admin/_actions/dashboardActions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types'; // Import typov pre lepšiu prácu s dátami

// Získanie celkového počtu produktov
export async function getProductCount(): Promise<{ count: number | null; error: string | null }> {
  const supabase = createClient();
    // Overenie session - základná ochrana
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        console.error('Authentication error in getProductCount:', sessionError);
        return { count: null, error: 'Chyba autentifikácie.' };
    }
    // TODO: Detailnejšia kontrola role (napr. len admin/manager)

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true }); // head: true získa len count

  if (error) {
    console.error('Error fetching product count:', error);
    return { count: null, error: 'Nepodarilo sa získať počet produktov.' };
  }

  return { count, error: null };
}

// Získanie celkového počtu skladov
export async function getWarehouseCount(): Promise<{ count: number | null; error: string | null }> {
  const supabase = createClient();
   // Overenie session - základná ochrana
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        console.error('Authentication error in getWarehouseCount:', sessionError);
        return { count: null, error: 'Chyba autentifikácie.' };
    }
    // TODO: Detailnejšia kontrola role (napr. len admin/manager)

  const { count, error } = await supabase
    .from('warehouses')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching warehouse count:', error);
    return { count: null, error: 'Nepodarilo sa získať počet skladov.' };
  }

  return { count, error: null };
}

// Helper function to get the start of a period in UTC ISO format
// Note: This relies on the server's timezone interpretation for start of day/week/month
// For robust timezone handling, consider a library like date-fns-tz
const getStartOfPeriodUTCISO = (period: 'day' | 'week' | 'month'): string => {
  const now = new Date();
  let startDate: Date;

  if (period === 'day') {
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  } else if (period === 'week') {
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
    const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff));
  } else { // month
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
  return startDate.toISOString();
}

// Interface pre výsledok tržieb
export interface RevenueStats {
    daily: number | null;
    weekly: number | null;
    monthly: number | null;
}

// Získanie štatistík tržieb
export async function getRevenueStats(): Promise<{ data: RevenueStats | null; error: string | null }> {
    const supabase = createClient();

    // Overenie session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        console.error('Authentication error in getRevenueStats:', sessionError);
        return { data: null, error: 'Chyba autentifikácie.' };
    }
    // TODO: Detailnejšia kontrola role

    const todayStart = getStartOfPeriodUTCISO('day');
    const weekStart = getStartOfPeriodUTCISO('week');
    const monthStart = getStartOfPeriodUTCISO('month');

    // Funkcia na získanie sumy pre daný časový rozsah
    const fetchRevenue = async (startDate: string): Promise<number | null> => {
        // Predpokladáme, že total_price nie je null v DB pre relevantné objednávky
        // Ak môže byť null, treba použiť .rpc alebo upraviť query
        const { data, error } = await supabase
            .from('orders')
            .select('total_price')
            .gte('created_at', startDate)
            // TODO: Pridať filter na status, napr. .eq('status', 'completed')
            ;

        if (error) {
            console.error(`Error fetching revenue since ${startDate}:`, error);
            // Nevrátime chybu hneď, aby sme skúsili získať ostatné periody
            return null;
        }
        // Suma sa počíta na strane klienta (Node.js server)
        return data?.reduce((sum, order) => sum + (order.total_price || 0), 0) ?? null;
    };

    try {
        // Súbežné načítanie súm pre všetky periódy
        const [dailyRevenue, weeklyRevenue, monthlyRevenue] = await Promise.all([
            fetchRevenue(todayStart),
            fetchRevenue(weekStart),
            fetchRevenue(monthStart),
        ]);

        // Skontrolujeme, či niektoré volanie nezlyhalo (vráti null)
        // Ak chceme vrátiť chybu pri akomkoľvek zlyhaní:
        // if (dailyRevenue === null || weeklyRevenue === null || monthlyRevenue === null) {
        //     return { data: null, error: 'Nepodarilo sa načítať niektoré štatistiky tržieb.' };
        // }

        const stats: RevenueStats = {
            daily: dailyRevenue,
            weekly: weeklyRevenue,
            monthly: monthlyRevenue,
        };

        return { data: stats, error: null };

    } catch (e) {
        console.error('Unexpected error fetching revenue stats:', e);
        return { data: null, error: 'Neočakávaná chyba pri načítaní štatistík tržieb.' };
    }
}

// Získanie počtu nevybavených objednávok (status 'pending')
export async function getPendingOrderCount(): Promise<{ count: number | null; error: string | null }> {
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return { count: null, error: 'Chyba autentifikácie.' };

    const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'); // Filter pre nevybavené

    if (error) {
        console.error('Error fetching pending order count:', error);
        return { count: null, error: 'Nepodarilo sa získať počet nevybavených objednávok.' };
    }
    return { count, error: null };
}

// Typ pre jednu objednávku v zozname posledných objednávok
// Použijeme generované typy z `database.types.ts` ak existujú a sú správne
type OrderWithProfile = Database['public']['Tables']['orders']['Row'] & {
    profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name'> | null;
};

// Získanie posledných N objednávok
export async function getRecentOrders(limit: number = 5): Promise<{ data: OrderWithProfile[] | null; error: string | null }> {
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return { data: null, error: 'Chyba autentifikácie.' };

    // Načítame objednávky spolu s profilom zákazníka (ak existuje vzťah a tabuľka profiles)
    // Uprav '!inner' na 'inner' ak chceš len objednávky s existujúcim profilom
    const { data, error } = await supabase
        .from('orders')
        // Explicitne vyberieme user_id pre istotu, aj keď * by ho malo zahrnúť
        .select(`
            *,
            user_id,
            profiles (
                full_name
            )
        `)
        .order('created_at', { ascending: false }) // Najnovšie prvé
        .limit(limit);

    if (error) {
        console.error('Error fetching recent orders:', error);
        // Možno skontrolovať špecifickú chybu, napr. neexistujúci vzťah 'profiles'
        if (error.message.includes('relation "profiles" does not exist')) {
             return { data: null, error: 'Nepodarilo sa načítať profily zákazníkov. Skontrolujte vzťah medzi tabuľkami orders a profiles.' };
        }
        return { data: null, error: 'Nepodarilo sa načítať posledné objednávky.' };
    }

    // Supabase vráti pole profilov, ale my očakávame jeden objekt alebo null
    // Ak nepoužívame generované typy, musíme typovať manuálne
    const typedData = data as unknown as OrderWithProfile[];

    return { data: typedData, error: null };
}

// TODO: Pridať ďalšie funkcie ako getOrderCount, getUserCount atď.
