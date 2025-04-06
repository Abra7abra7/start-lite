import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm'; // Opravený pomenovaný import
import { notFound } from 'next/navigation';

// Typ pre parametre stránky (z URL)
interface EditProductPageProps {
  params: {
    id: string; // ID produktu z URL
  };
}

// Server Component pre načítanie dát produktu
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const supabase = createClient();

  console.log(`Loading product data for edit page, ID: ${id}`);

  // Načítame dáta produktu podľa ID
  const { data: product, error } = await supabase
    .from('products')
    .select('*'/* DEBUG: Fetching all columns for edit */)
    .eq('id', id)
    .single(); // Očakávame presne jeden výsledok

  if (error || !product) {
    console.error(`Error fetching product with ID ${id} for edit:`, error);
    notFound(); // Zobrazí štandardnú 404 stránku, ak produkt neexistuje
  }

  console.log('Product data fetched for edit:', product);

  // Predáme načítané dáta ako `initialData` do ProductForm
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upraviť Produkt</h1>
      {/* Odovzdáme produkt ako initialData a nastavíme mode na 'edit' */}
      <ProductForm initialData={product} mode="edit" />
    </div>
  );
}
