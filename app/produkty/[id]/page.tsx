import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from 'next/navigation';
import { ProductAddToCart } from "@/components/ProductAddToCart";

// Opt out of caching for this page, server-side render always
export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
    params: {
        id: string; // Product ID from the URL
    };
}

export default async function ProduktDetailPage({ params }: ProductDetailPageProps) {
    const supabase = createClient();
    const productId = params.id;

    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId) // Filter by product ID
        .single(); // Expect only one result

    if (error || !product) {
        console.error(`Chyba pri načítaní produktu ${productId}:`, error);
        // If product not found or other error, show 404 page
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {/* Update link to Slovak path */}
                <Link href="/produkty">
                    <Button variant="outline">Späť na Produkty</Button>
                </Link>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image (Placeholder if no image_url) */}
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Obrázok nie je k dispozícii
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-start">
                    <p className="text-gray-700 mb-4">{product.description || "Podrobný popis nie je k dispozícii."}</p>
                    <p className="text-2xl font-semibold mb-4">€{product.price}</p>
                    <p className="text-gray-600 mb-6">Skladom: {product.stock}</p>

                    {/* Use the client component for Add to Cart (ProductAddToCart already handles texts) */}
                    <ProductAddToCart
                        product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image_url: product.image_url || undefined // Pass image if available
                        }}
                        stock={product.stock}
                    />
                </div>
            </div>
        </div>
    );
}
