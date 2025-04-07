import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

// Typ pre parametre stránky (z URL) - zmenené id na productId
interface EditProductPageProps {
  params: {
    productId: string; // ID produktu z URL - ZMENENÉ
  };
}

// Server Component pre načítanie dát produktu
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = params; // Použijeme productId - ZMENENÉ
  const supabase = createClient();

  console.log(`Loading product data for edit page, ID: ${productId}`); // Logujeme productId

  // Načítame dáta produktu podľa ID - použijeme productId
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId) // Hľadáme podľa productId v stĺpci 'id'
    .single();

  if (error || !product) {
    console.error(`Error fetching product with ID ${productId} for edit:`, error);
    notFound();
  }

  console.log('Product data fetched for edit:', product);

  // Predáme načítané dáta ako `initialData` do ProductForm
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upraviť Produkt</h1>
      <ProductForm initialData={product} mode="edit" />
    </div>
  );
}
