import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Add Image import
import { notFound } from 'next/navigation'; // For handling product not found

// Opt out of caching for this page, server-side render always
export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
    params: {
        id: string; // Product ID from the URL
    };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const supabase = createClient();
    const productId = params.id;

    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId) // Filter by product ID
        .single(); // Expect only one result

    if (error || !product) {
        console.error(`Error fetching product ${productId}:`, error);
        // If product not found or other error, show 404 page
        notFound();
    }

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-8 px-4">
             <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Link href="/products">
                    <Button variant="outline">Back to Products</Button>
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
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-start">
                    <p className="text-gray-700 mb-4">{product.description || "No detailed description available."}</p>
                    <p className="text-2xl font-semibold mb-4">€{product.price}</p>
                    <p className="text-gray-600 mb-6">Stock: {product.stock}</p>

                    {/* TODO: Add to Cart Button/Functionality */}
                    <Button size="lg" disabled={product.stock <= 0}>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
