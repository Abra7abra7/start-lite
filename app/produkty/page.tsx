import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { SortDropdown } from '@/components/produkty/SortDropdown'; // Import nového komponentu
import { CategoryFilter } from '@/components/produkty/CategoryFilter'; // Import filtra kategórií

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <Link key={product.id} href={`/produkty/${product.id}`} className="group block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col transform hover:-translate-y-1">
            {/* Obrázok produktu */}
            <div className="relative w-full h-48 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name ?? 'Produkt'}
                  fill // Vyplní kontajner
                  style={{ objectFit: 'cover' }} // Oreže obrázok, aby vyplnil priestor bez deformácie
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Optimalizácia pre rôzne veľkosti obrazovky
                  className="group-hover:scale-105 transition-transform duration-300 ease-in-out" // Efekt pri hoveri
                />
              ) : (
                // Fallback, ak obrázok neexistuje
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                  Žiadny obrázok
                </div>
              )}
            </div>
            {/* Detaily produktu pod obrázkom */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 truncate group-hover:text-blue-600 transition-colors">{product.name}</h2>
              <p className="text-gray-600 mb-3 text-sm line-clamp-2 flex-grow min-h-[40px]">{product.description || "Popis nie je k dispozícii."}</p>
              <p className="font-bold text-lg mb-3">{product.price ? `${product.price.toFixed(2)} €` : 'Cena neuvedená'}</p>
              {/* Zobrazenie dostupnosti */}
              <div className="mb-3">
                {typeof product.stock === 'number' && product.stock > 0 ? (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800">
                    Skladom ({product.stock} ks)
                  </span>
                ) : typeof product.stock === 'number' && product.stock <= 0 ? (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-red-100 text-red-800">
                    Vypredané
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
                    Dostupnosť neznáma
                  </span>
                )}
              </div>
              <div className="mt-auto pt-2 text-blue-600 font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Zobraziť Detail
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
