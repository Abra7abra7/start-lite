import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SortDropdown } from '@/components/produkty/SortDropdown'; // Import nového komponentu
import { CategoryFilter } from '@/components/produkty/CategoryFilter'; // Import filtra kategórií
import { ProductCard } from '@/components/produkty/ProductCard'; // Import nového komponentu karty
import { Metadata } from 'next'; // Import Metadata type

// Statické metadáta pre stránku so zoznamom produktov
export const metadata: Metadata = {
  title: 'Všetky vína | Pútec Vína',
  description: 'Objavte našu kompletnú ponuku kvalitných slovenských vín z Vinosadov. Biele, červené, ružové a špeciálne vína priamo od vinára.',
  // Môžeme pridať aj openGraph a twitter metadáta špecifické pre túto stránku, ak je to potrebné
  // openGraph: {
  //   title: 'Všetky vína | Pútec Vína',
  //   description: 'Kompletná ponuka vín Pútec.',
  // },
};

// Opt out of caching for this page, server-side render always
export const dynamic = "force-dynamic";

// Definovanie typov pre searchParams
interface ProduktyPageProps {
  searchParams: {
    sort?: string;
    category?: string; // Pridaný parameter pre kategóriu
  };
}

export default async function ProduktyPage({ searchParams }: ProduktyPageProps) {
  const supabase = createClient();

  // --- 1. Načítanie VŠETKÝCH unikátnych kategórií --- 
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('products')
    .select('category')
    .neq('category', '') // Obnovený filter pre prázdne kategórie
    .not('category', 'is', null) // Správny filter pre NOT NULL
    .limit(1000); // Explicitne zvýšime limit, predvolený môže byť nižší

  const uniqueCategories = categoriesData
    ? Array.from(new Set(categoriesData.map(p => p.category))) as string[]
    : [];

  if (categoriesError) {
    console.error("Chyba pri načítaní kategórií:", categoriesError);
    // Zobraz varovanie, ale skús pokračovať bez filtra
  }

  // --- 2. Spracovanie parametrov a vytvorenie dopytu na PRODUKTY ---
  // Spracovanie parametra triedenia
  const sortParam = searchParams.sort || 'created_at,desc';
  const [sortField, sortOrder] = sortParam.split(',');
  const validSortFields = ['created_at', 'price', 'name'];
  const validSortOrders = ['asc', 'desc'];
  const field = validSortFields.includes(sortField) ? sortField : 'created_at';
  const order = validSortOrders.includes(sortOrder) ? sortOrder === 'asc' : false;

  // Spracovanie parametra kategórie
  const categoryParam = searchParams.category;

  // Vytvorenie dopytu na produkty
  let productQuery = supabase
    .from("products")
    .select("*")
    .order(field, { ascending: order }); // Použitie dynamického triedenia

  // Pridanie filtra kategórie, ak je špecifikovaná
  if (categoryParam) {
    productQuery = productQuery.eq('category', categoryParam);
  }

  // Vykonanie dopytu na produkty (už s možnými filtrami)
  const { data: products, error: productsError } = await productQuery;

  if (productsError) {
    console.error("Chyba pri načítaní produktov:", productsError);
    return <p className="text-center text-red-500">Nepodarilo sa načítať produkty.</p>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        {/* Zobrazenie hlavičky a filtrov aj keď nie sú produkty */}
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Naše Produkty {categoryParam ? `(${categoryParam})` : ''}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Zoradiť podľa:</span>
              <SortDropdown defaultValue={sortParam} />
            </div>
            <Link href="/">
              <Button variant="outline">Späť Domov</Button>
            </Link>
            {/* Zobrazenie filtrov aj keď nie sú produkty */}
            <div className="mt-4 w-full">
              <h3 className="text-lg font-semibold mb-3">Kategórie</h3>
              <CategoryFilter categories={uniqueCategories} currentCategory={categoryParam} />
            </div>
          </div>
        </div>
        <p className="text-center mt-10">Nenašli sa žiadne produkty{categoryParam ? ` v kategórii ${categoryParam}` : ''}.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Naše Produkty {categoryParam ? `(${categoryParam})` : ''}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Zoradiť podľa:</span>
            <SortDropdown defaultValue={sortParam} />
          </div>
          <Link href="/">
            <Button variant="outline">Späť Domov</Button>
          </Link>
        </div>
      </div>

      {/* Filter kategórií */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Kategórie</h3>
        {/* Použitie klientského komponentu pre filter */}
        <CategoryFilter categories={uniqueCategories} currentCategory={categoryParam} />
      </div>

      {/* Zmena: Znížený počet stĺpcov na md a lg pre širšie karty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {products.map((product) => (
          // Použitie nového komponentu ProductCard
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
