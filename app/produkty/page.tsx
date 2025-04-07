import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Opt out of caching for this page, server-side render always
export const dynamic = "force-dynamic";

export default async function ProduktyPage() {
    const supabase = createClient();
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Chyba pri načítaní produktov:", error);
        return <p className="text-center text-red-500">Nepodarilo sa načítať produkty.</p>;
    }

    if (!products || products.length === 0) {
        return <p className="text-center">Nenašli sa žiadne produkty.</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Naše Produkty</h1>
                {/* Optional: Link back home */}
                <Link href="/">
                    <Button variant="outline">Späť Domov</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {products.map((product) => (
                    <Link key={product.id} href={`/produkty/${product.id}`} className="group block border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200 flex flex-col">
                        {/* Obrázok produktu */}
                        <div className="relative w-full aspect-square bg-gray-100"> {/* Kontajner pre obrázok */}
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
                            <p className="text-gray-600 mb-2 text-sm line-clamp-2 flex-grow">{product.description || "Popis nie je k dispozícii."}</p>
                            <p className="font-bold text-lg mb-3">{product.price ? `${product.price.toFixed(2)} €` : 'Cena neuvedená'}</p>
                            {/* Skladom - voliteľné */}
                            {/* <p className="text-sm text-gray-500">Skladom: {product.stock ?? 'N/A'}</p> */}
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
