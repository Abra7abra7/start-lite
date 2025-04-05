import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Button } from "@/components/ui/button"; // Assuming Button exists
import Link from 'next/link';
// Assuming Table components exist from shadcn/ui
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 


export default async function AdminProductsPage() {
  const supabase = createClient();

  // Fetch products - adjust columns as needed based on your table schema
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, created_at') // Example columns
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    // Handle error display appropriately
    return <p className="text-red-500">Chyba pri načítaní produktov: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Správa Produktov</h1>
        {/* TODO: Link to actual create product page */}
        <Button asChild>
          <Link href="/admin/produkty/novy">Pridať nový produkt</Link>
        </Button>
      </div>

      <Table>
        <TableCaption>Zoznam produktov vo vašom obchode.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Názov</TableHead>
            <TableHead>Cena</TableHead> // Adjust formatting later
            <TableHead>Vytvorené</TableHead>
            <TableHead className="text-right">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name ?? '-'}</TableCell>
                <TableCell>{product.price ?? '-'}</TableCell> 
                <TableCell>{product.created_at ? new Date(product.created_at).toLocaleDateString('sk-SK') : '-'}</TableCell>
                <TableCell className="text-right">
                  {/* TODO: Add Edit/Delete buttons/links */}
                  <Button variant="outline" size="sm" asChild className="mr-2">
                     <Link href={`/admin/produkty/upravit/${product.id}`}>Upraviť</Link>
                  </Button>
                   <Button variant="destructive" size="sm">
                     Vymazať
                   </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenašli sa žiadne produkty.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
