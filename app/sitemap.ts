import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server'; // Potrebujeme serverového klienta

// !!! DÔLEŽITÉ: Nastav túto URL na skutočnú doménu tvojho webu !!!
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tvojadomena.sk'; 

// Definícia povolených hodnôt pre changeFrequency
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 1. Statické stránky
  const staticRoutes = [
    { route: '/', changeFreq: 'daily' as ChangeFrequency, priority: 1.0 },
    { route: '/produkty', changeFreq: 'weekly' as ChangeFrequency, priority: 0.9 },
    { route: '/o-nas', changeFreq: 'monthly' as ChangeFrequency, priority: 0.7 },
    { route: '/degustacie', changeFreq: 'monthly' as ChangeFrequency, priority: 0.6 },
    { route: '/penzion', changeFreq: 'monthly' as ChangeFrequency, priority: 0.6 },
    { route: '/kontakt', changeFreq: 'yearly' as ChangeFrequency, priority: 0.5 },
    { route: '/kosik', changeFreq: 'never' as ChangeFrequency, priority: 0.4 }, // Košík sa pre SEO neindexuje často
    { route: '/prihlasenie', changeFreq: 'yearly' as ChangeFrequency, priority: 0.4 },
    { route: '/registracia', changeFreq: 'yearly' as ChangeFrequency, priority: 0.4 },
    { route: '/obchodne-podmienky', changeFreq: 'yearly' as ChangeFrequency, priority: 0.3 },
    { route: '/ochrana-osobnych-udajov', changeFreq: 'yearly' as ChangeFrequency, priority: 0.3 },
    { route: '/reklamacny-poriadok', changeFreq: 'yearly' as ChangeFrequency, priority: 0.3 },
  ].map(({ route, changeFreq, priority }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: changeFreq, // Teraz má správny typ
    priority: priority,
  }));

  // 2. Dynamické stránky produktov
  // Načítame ID všetkých produktov
  const { data: products, error } = await supabase
    .from('products')
    .select('id, updated_at') // Načítame aj updated_at pre lastModified
    .eq('is_visible', true); // Príklad: iba viditeľné produkty

  if (error) {
    console.error('Error fetching products for sitemap:', error);
    // Ak nastane chyba, vrátime aspoň statické cesty
    return staticRoutes;
  }

  const productRoutes = products ? products.map((product) => ({
    url: `${BASE_URL}/produkty/${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly' as ChangeFrequency, // Produkty sa môžu meniť
    priority: 0.9, // Vysoká priorita pre produkty
  })) : [];

  // TODO: Prípadne pridať dynamické cesty pre kategórie, ak sú dôležité
  // const { data: categories } = await supabase.from('categories').select('slug, updated_at');
  // const categoryRoutes = categories ? categories.map(cat => ({})) : [];

  // Spojíme všetky cesty
  return [
    ...staticRoutes,
    ...productRoutes,
    // ...categoryRoutes, 
  ];
}
