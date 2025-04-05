import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
                    // Update link to Slovak path
                    <Link key={product.id} href={`/produkty/${product.id}`} className="block border rounded-lg p-4 shadow hover:shadow-md transition-shadow group">
                        {/* Placeholder for Image */}
                        <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                            Obrázok
                        </div>
                        <h2 className="text-lg font-semibold mb-2 truncate group-hover:text-blue-600 transition-colors">{product.name}</h2>
                        <p className="text-gray-600 mb-1 text-sm line-clamp-2">{product.description || "Popis nie je k dispozícii."}</p>
                        <p className="font-bold text-lg mb-3">€{product.price}</p>
                        <p className="text-sm text-gray-500">Skladom: {product.stock}</p>
                        <div className="mt-2 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Zobraziť Detail
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
