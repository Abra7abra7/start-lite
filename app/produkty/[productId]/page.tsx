import { getProductById } from '@/lib/actions/products';
import { notFound } from 'next/navigation'; // Pre prípad, že produkt neexistuje
import { ProductDetailCard } from '@/components/products/ProductDetailCard'; // <-- Import nového komponentu

// Komponent musí byť async, aby sme mohli použiť await pre serverovú akciu
export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params;

  // Zavoláme serverovú akciu na získanie produktu
  const { product, error } = await getProductById(productId);

  // Spracovanie chýb alebo nenájdeného produktu
  if (error) {
    // Môžeme zobraziť všeobecnú chybovú stránku alebo špecifickú správu
    // Pre jednoduchosť teraz zobrazíme správu priamo tu
    // V reálnej aplikácii by sme mohli mať dedikovaný error component
    console.error("Error fetching product:", error.message);
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-red-600">Chyba pri načítaní produktu</h1>
            <p>{error.message || 'Nastala neočakávaná chyba.'}</p>
        </div>
    );
  }

  if (!product) {
    // Ak produkt nebol nájdený (žiadna chyba, len prázdne dáta), použijeme notFound() z Next.js
    // To zobrazí štandardnú 404 stránku definovanú v app/not-found.tsx (ak existuje)
    notFound();
  }

  // Použijeme ProductDetailCard na zobrazenie produktu
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailCard product={product} /> {/* <-- Použitie komponentu */}
    </div>
  );
}

// Voliteľné: Generovanie metadata pre stránku (názov v záložke prehliadača)
export async function generateMetadata({ params }: { params: { productId: string } }) {
    const { productId } = params;
    const { product } = await getProductById(productId);

    if (!product) {
        return {
            title: 'Produkt nenájdený',
        };
    }

    return {
        title: `${product.name} | Pútec Vína`, // Prispôsobený názov e-shopu
        description: product.description || `Detail produktu ${product.name}`,
    };
}
