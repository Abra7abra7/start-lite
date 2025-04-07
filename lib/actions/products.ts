'use server';

import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/product'; // Predpokladáme, že typ Product je definovaný tu
import { PostgrestError } from '@supabase/supabase-js';

interface GetProductResult {
  product: Product | null;
  error: PostgrestError | null | { message: string };
}

export async function getProductById(productId: string): Promise<GetProductResult> {
  // Validácia ID (základná)
  if (!productId || typeof productId !== 'string') {
    console.error('Invalid product ID provided:', productId);
    return { product: null, error: { message: 'Neplatné ID produktu.' } };
  }

  const supabase = createClient();

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*') // Načítame všetky stĺpce
      .eq('id', productId)
      .single(); // Očakávame jeden záznam alebo null

    if (error) {
      if (error.code === 'PGRST116') {
        // Špecifický kód pre "Not found"
        console.warn(`Product with ID ${productId} not found.`);
        return { product: null, error: { message: `Produkt s ID ${productId} sa nenašiel.` } };
      }
      console.error('Error fetching product by ID:', error);
      return { product: null, error };
    }

    if (!product) {
        console.warn(`Product with ID ${productId} not found (data is null).`);
        return { product: null, error: { message: `Produkt s ID ${productId} sa nenašiel.` } };
    }

    // Vrátime nájdený produkt (typ Product by mal zodpovedať štruktúre v DB)
    return { product: product as Product, error: null };

  } catch (err) {
    console.error('Unexpected error in getProductById:', err);
    const message = err instanceof Error ? err.message : 'Nastala neočakávaná chyba pri načítaní produktu.';
    return { product: null, error: { message } };
  }
}
