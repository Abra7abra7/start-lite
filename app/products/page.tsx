import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Opt out of caching for this page, server-side render always
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    const supabase = createClient();
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        // Optionally return a more user-friendly error message component
        return <p className="text-center text-red-500">Could not fetch products.</p>;
    }

    if (!products || products.length === 0) {
        return <p className="text-center">No products found.</p>;
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-8 px-4">
             <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                {/* Optional: Link back home */}
                <Link href="/">
                    <Button variant="outline">Back Home</Button>
                </Link>
            </div>

            {/* Simple list display for now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="block border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                        {/* Basic product info - TODO: Add image */}
                        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-1 line-clamp-2">{product.description || "No description available."}</p>
                        <p className="font-bold text-lg mb-3">€{product.price}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        <div className="mt-2 text-blue-600 hover:underline">
                            View Details
                        </div>
                         {/* TODO: Add to Cart button (maybe smaller version here?) */}
                    </Link>
                ))}
            </div>
        </div>
    );
}
