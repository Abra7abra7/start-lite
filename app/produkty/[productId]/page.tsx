import { getProductById } from '@/lib/actions/products';
import { notFound } from 'next/navigation'; // Pre prípad, že produkt neexistuje
import { ProductDetailCard } from '@/components/products/ProductDetailCard'; // <-- Import nového komponentu
import Script from 'next/script'; // Import Script for JSON-LD

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
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-red-600">Chyba pri načítaní produktu</h1>
            <p>{error.message || 'Nastala neočakávaná chyba.'}</p>
        </div>
    );
  }

  if (!product) {
    // Ak produkt nebol nájdený (žiadna chyba, len prázdne dáta), použijeme notFound() z Next.js
    // To zobrazí štandardnú 404 stránku definovanú v app/not-found.tsx (ak existuje)
    notFound();
  }

  // Typ pre dáta produktu používané v JSON-LD schéme
  interface ProductDataForSchema {
    id: string | number; // Alebo aký typ je ID
    name: string;
    description?: string | null;
    image_url?: string | null;
    price: number;
    stock_quantity?: number; // Zmenené na voliteľné
    sku?: string | null;
    updated_at?: string | null; // Pridané pre lastModified v sitemape, môže byť užitočné
  }

  // Funkcia na generovanie JSON-LD dát
  const generateProductJsonLd = (product: ProductDataForSchema, productUrl: string) => {
    // Použijeme predvolenú hodnotu 0, ak stock_quantity nie je definované
    const stock = product.stock_quantity ?? 0; 
    const availability = stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
    
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image: product.image_url || '',
        sku: product.sku || product.id, // Použijeme SKU ak existuje, inak ID
        brand: {
            '@type': 'Brand',
            name: 'Pútec Vína',
        },
        offers: {
            '@type': 'Offer',
            url: productUrl, // Kanonická URL produktu
            priceCurrency: 'EUR',
            price: product.price.toFixed(2), // Formátovanie ceny na 2 desatinné miesta
            availability: availability,
            // seller: { // Voliteľné, ak chcete pridať informácie o predajcovi
            //     '@type': 'Organization',
            //     name: 'Pútec Vína'
            // }
        },
        // TODO: Pridať 'aggregateRating' ak máte systém hodnotenia produktov
        // aggregateRating: {
        //     '@type': 'AggregateRating',
        //     ratingValue: '4.5', // Priemerné hodnotenie
        //     reviewCount: '15' // Počet recenzií
        // }
    };
};

  // Konštrukcia kanonickej URL pre JSON-LD
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/produkty/${productId}`;
  const jsonLd = generateProductJsonLd(product as ProductDataForSchema, productUrl);

  // Použijeme ProductDetailCard na zobrazenie produktu
  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Script pre štruktúrované dáta */}
      <Script 
        id={`product-jsonld-${productId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
