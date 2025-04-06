'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server'; // Použijeme serverového klienta
import { revalidatePath } from 'next/cache';
import { Product } from "@/types/product"; // Import typu Product

// Schéma pre validáciu dát na serveri (podobná ako na klientovi, pridáme stock)
// Poznámka: image_url posielame ako string, keďže upload je na klientovi
const productActionSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0), // Pridaný stock
  category: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(), // URL obrázka z klienta
});

// Typ pre dáta produktu posielané z formulára
export type ProductData = z.infer<typeof productActionSchema>;

// Definuje návratový stav/typ pre Server Action
export type AddProductState = {
  error?: string | null;
  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    stock?: string[];
    category?: string[];
    image_url?: string[];
  } | null;
  success: boolean;
  data?: ProductData | null; // Použijeme definovaný typ ProductData
};

export async function addProduct(
  prevState: AddProductState, // Použijeme definovaný typ stavu
  formData: FormData // Tento parameter sa teraz použije
): Promise<AddProductState> { // Explicitný návratový typ

  console.log('Server Action addProduct called with FormData');

  // 1. Extrahujeme dáta z FormData
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    image_url: formData.get('image_url'),
  };

  // 2. Validácia dát pomocou Zod schémy
  const validatedFields = productActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Server Action Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Neplatné dáta formulára.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, description, price, stock, category, image_url } = validatedFields.data;

  // 3. Vytvorenie Supabase klienta
  const supabase = createClient(); // Serverový klient

  // 4. Vloženie do databázy
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name,
        description: description || null,
        price,
        stock, // Pridaný stock
        category: category || null,
        image_url: image_url || null,
        // id a created_at by mali byť generované DB
      },
    ])
    .select() // Vrátiname vložený záznam
    .single(); // Očakávame jeden záznam

  // 5. Spracovanie výsledku
  if (error) {
    console.error('Supabase Insert Error:', error);
    return {
      error: `Chyba pri ukladaní produktu do databázy: ${error.message}`,
      success: false, // Pridáme success flag
      fieldErrors: null, // Pri chybe databázy nevraciame field errors
    };
  }

  console.log('Product inserted successfully:', data);

  // 6. Revalidácia cesty (aby sa zoznam produktov aktualizoval)
  revalidatePath('/admin/produkty'); // Cesta k zoznamu produktov
  revalidatePath('/'); // Prípadne aj hlavná stránka, ak zobrazuje produkty

  // 7. Presmerovanie (voliteľné, odkomentuj ak treba a importuj redirect)
  // redirect('/admin/produkty');

  // 8. Vrátime úspešný stav
  return { success: true, data: data[0] };
}

// Typ pre stav mazania (voliteľné, pre prípad použitia useFormState)
export type DeleteProductState = {
  success: boolean;
  error?: string | null;
};

export async function deleteProduct(
  // prevState: DeleteProductState, // Ak by sme použili useFormState
  formData: FormData // ID pošleme cez FormData
): Promise<DeleteProductState> {
  const supabase = createClient();
  const productId = formData.get('productId') as string;

  if (!productId) {
    return { success: false, error: 'Chýba ID produktu.' };
  }

  console.log(`Server Action deleteProduct called for ID: ${productId}`);

  try {
    // 1. Získať URL obrázka pred zmazaním produktu (voliteľné, ale odporúčané)
    const { data: productData, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      // Ak chyba nie je len 'nenájdený riadok', berieme to ako problém
      console.error('Error fetching product image URL before delete:', fetchError);
      // Môžeme sa rozhodnúť pokračovať v mazaní alebo vrátiť chybu
      // return { success: false, error: 'Chyba pri hľadaní produktu pred mazaním.' };
    }

    // 2. Zmazať produkt z databázy
    const { error: deleteDbError } = await supabase
      .from('products')
      .delete()
      .match({ id: productId });

    if (deleteDbError) {
      console.error('Error deleting product from DB:', deleteDbError);
      return { success: false, error: `Chyba pri mazaní produktu z databázy: ${deleteDbError.message}` };
    }

    // 3. Zmazať obrázok zo Storage, ak existoval
    if (productData?.image_url) {
      try {
        // Extrahujeme cestu k súboru z URL
        const imageUrl = productData.image_url;
        const bucketName = 'product-images'; // Názov tvojho bucketu
        const filePath = imageUrl.substring(imageUrl.indexOf(`/${bucketName}/`) + `/${bucketName}/`.length);

        if (filePath) {
          console.log(`Attempting to delete image from storage: ${filePath}`);
          const { error: deleteStorageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (deleteStorageError) {
            // Chybu pri mazaní obrázka môžeme len zalogovať a neblokovať úspech mazania produktu
            console.warn('Warning: Failed to delete product image from storage:', deleteStorageError);
          }
        }
      } catch (pathError) {
          console.warn('Warning: Could not parse file path from image_url for deletion:', pathError);
      }
    }

    // 4. Revalidácia cesty
    revalidatePath('/admin/produkty'); // Pre admin zoznam
    // revalidatePath('/produkty'); // Ak máš aj verejný zoznam produktov

    console.log(`Product with ID: ${productId} deleted successfully.`);
    return { success: true };

  } catch (e) {
    console.error('Unexpected error during product deletion:', e);
    return { success: false, error: 'Neočakávaná chyba počas mazania produktu.' };
  }
}

// Typ pre stav úpravy (podobný ako pri pridaní)
export type UpdateProductState = AddProductState; // Môžeme použiť rovnaký stavový objekt

export async function updateProduct(
  prevState: UpdateProductState, // Pridaný prevState
  formData: FormData
): Promise<UpdateProductState> {
  const supabase = createClient();
  const productId = formData.get('productId') as string;
  const oldImageUrl = formData.get('oldImageUrl') as string | null; // Získame pôvodnú URL

  if (!productId) {
    return { success: false, error: 'Chýba ID produktu pre úpravu.' };
  }

  console.log(`Server Action updateProduct called for ID: ${productId}`);

  let newImageUrl: string | null = oldImageUrl; // Predvolene ponecháme starú
  let uploadedNewFile = false;

  // 1. Skontrolujeme a prípadne nahráme nový obrázok
  if (formData.has('imageFile')) {
    const imageFile = formData.get('imageFile') as File;
    console.log('New image file found, attempting upload...');

    if (imageFile && imageFile.size > 0) {
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2)}_${imageFile.name}`;
      const filePath = `${fileName}`;
      const bucketName = 'product-images';

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading new image:', uploadError);
          return { success: false, error: `Chyba pri nahrávaní nového obrázka: ${uploadError.message}` };
        }

        // Získame verejnú URL práve nahraného obrázka
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          newImageUrl = publicUrlData.publicUrl;
          uploadedNewFile = true;
          console.log('New image uploaded successfully:', newImageUrl);
        } else {
          console.error('Could not get public URL for uploaded image.');
          // Môžeme buď vrátiť chybu, alebo pokračovať bez obrázka
          return { success: false, error: 'Nepodarilo sa získať URL nahraného obrázka.' };
        }
      } catch (uploadCatchError) {
        console.error('Unexpected error during image upload:', uploadCatchError);
        return { success: false, error: 'Neočakávaná chyba pri nahrávaní obrázka.' };
      }
    } else {
      console.log('Image file entry exists but is empty or invalid.');
      // Ak klient poslal imageFile, ale je prázdny, znamená to, že obrázok bol odstránený
      newImageUrl = null;
      uploadedNewFile = true; // Označíme, že sa manipulovalo s obrázkom (odstránenie)
    }
  } else {
    // Ak klient neposlal 'imageFile', znamená to, že obrázok sa nemá meniť
    // newImageUrl už má hodnotu oldImageUrl zhora
    console.log('No new image file submitted, keeping old image URL (if any).');
  }

  // 2. Extrahujeme a validujeme ostatné dáta
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    // image_url tu už nepoužijeme priamo z formData, máme newImageUrl
  };

  // Validácia bez image_url, keďže to riešime separátne
  const validatedFields = productActionSchema.omit({ image_url: true }).safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Server validation failed (text fields):', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      error: 'Neplatné údaje formulára (textové polia).',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const productData = validatedFields.data;
  console.log('Validated text data for update:', productData);

  try {
    // 3. Aktualizujeme produkt v databáze s novou URL obrázka
    const { data, error: updateError } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        image_url: newImageUrl, // Použijeme spracovanú URL
      })
      .match({ id: productId })
      .select() // Vraciame upravený záznam
      .single(); // Očakávame jeden záznam

    if (updateError) {
      console.error('Error updating product in DB:', updateError);
      return { success: false, error: `Chyba pri aktualizácii produktu: ${updateError.message}` };
    }

    // 4. Ak bol nahraný nový obrázok a starý existoval, zmažeme starý obrázok
    // (uploadedNewFile je true aj pri odstránení obrázka)
    if (uploadedNewFile && oldImageUrl) {
        try {
            const bucketName = 'product-images';
            // Extrahujeme cestu k súboru z URL
            const oldFilePath = new URL(oldImageUrl).pathname.split(`/${bucketName}/`)[1];
            if (oldFilePath) {
                console.log(`Deleting old image from storage: ${oldFilePath}`);
                const { error: deleteStorageError } = await supabase.storage
                    .from(bucketName)
                    .remove([oldFilePath]);
                if (deleteStorageError) {
                    console.warn('Warning: Failed to delete old product image from storage:', deleteStorageError);
                    // Nejde o kritickú chybu, logujeme varovanie
                }
            }
        } catch(pathError) {
            console.warn('Warning: Could not parse old file path from image_url for deletion:', pathError);
        }
    }

    // 5. Revalidácia cesty
    revalidatePath('/admin/produkty');
    revalidatePath(`/admin/produkty/upravit/${productId}`); // Aj stránku úprav

    console.log(`Product with ID: ${productId} updated successfully.`);
    // Vrátime upravené dáta, použijeme importovaný typ Product
    return { success: true, data: data as Product };

  } catch (e) {
    console.error('Unexpected error during product update:', e);
    return { success: false, error: 'Neočakávaná chyba počas úpravy produktu.' };
  }
}

// Funkcia na úpravu produktu (podobná štruktúra)
// export async function updateProduct(id: string, productData: ProductData) { ... }
