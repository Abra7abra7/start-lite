import React from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CirclePlus, Pencil } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // Helper for currency formatting
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'; // Importujeme nový komponent
import Image from 'next/image';

// Define the type for a product based on your Supabase table
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  created_at: string;
  // Add other fields as necessary
}

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*'/* DEBUG: Fetching all columns */)
    .order('name', { ascending: true });

  // --- DEBUG LOG --- >
  console.log("Fetched products:", products?.map(p => ({ id: p.id, name: p.name, imageUrl: p.image_url })));
  // < --- DEBUG LOG ---

  if (error) {
    console.error("Error fetching products:", error);
    // TODO: Implement better error display (e.g., toast notification)
    return <p className="text-red-500">Chyba pri načítaní produktov: {error.message}</p>;
  }

  if (!products || products.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Správa Produktov</h1>
          <Button asChild>
            <Link href="/admin/produkty/novy">
              <CirclePlus className="mr-2 h-4 w-4" /> Pridať Produkt
            </Link>
          </Button>
        </div>
        <p>Zatiaľ neboli pridané žiadne produkty.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Správa Produktov</h1>
        <Button asChild>
          <Link href="/admin/produkty/novy"> {/* Link to the new product page */}
            <CirclePlus className="mr-2 h-4 w-4" /> Pridať Produkt
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>Zoznam všetkých produktov v e-shope.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Obrázok</TableHead>
            <TableHead>Názov</TableHead>
            <TableHead>Kategória</TableHead>
            <TableHead className="text-right">Cena</TableHead>
            <TableHead className="text-right">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: Product) => (
            <TableRow key={product.id}>
              <TableCell>
                {/* Basic placeholder for image */}
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    width={40} 
                    height={40} 
                    className="object-cover rounded" 
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">Bez obr.</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category || '-'}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">
                {/* Edit Button */}
                <Button variant="ghost" size="icon" asChild>
                  <Link 
                    href={`/admin/produkty/upravit/${product.id}`}
                    title="Upraviť"
                    // Props like className could also be moved here if needed
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                {/* Delete Button - teraz použije klientský komponent */}
                <DeleteProductButton productId={product.id} productName={product.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
