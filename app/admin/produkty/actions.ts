'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server'; 
import { revalidatePath } from 'next/cache';
import { Product } from "@/types/product"; 

// Schéma pre validáciu dát na serveri
const productActionSchema = z.object({
  name: z.string().min(3, { message: 'Názov musí mať aspoň 3 znaky.' }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive({ message: 'Cena musí byť kladné číslo.' }),
  stock: z.coerce.number().int().min(0, { message: 'Skladové zásoby nemôžu byť záporné.' }),
  category: z.string().optional().nullable(),
  image_url: z.string().url({ message: 'Neplatná URL obrázka.' }).optional().nullable(),
  // Nové polia
  color_detail: z.string().optional().nullable(),
  taste_detail: z.string().optional().nullable(),
  aroma_detail: z.string().optional().nullable(),
  wine_type: z.string().optional().nullable(),
  wine_region: z.string().optional().nullable(),
  residual_sugar: z.string().optional().nullable(),
  sugar_content_nm: z.string().optional().nullable(),
  volume: z.string().optional().nullable(),
  storage_temp: z.string().optional().nullable(),
  serving_temp: z.string().optional().nullable(),
  batch_number: z.string().optional().nullable(),
  allergens: z.string().optional().nullable(),
  alcohol_content: z.string().optional().nullable(),
  producer: z.string().optional().nullable(),
  bottler: z.string().optional().nullable(),
  country_of_origin: z.string().optional().nullable(),
  ean_link: z.string().url({ message: 'Neplatná URL EAN linku.' }).optional().nullable(),
});

// Typ pre dáta produktu posielané z formulára
export type ProductData = z.infer<typeof productActionSchema>;

// Definuje návratový stav/typ pre Server Action
export type AddProductState = {
  error?: string | null;
  fieldErrors?: z.inferFlattenedErrors<typeof productActionSchema>['fieldErrors']; 
  success: boolean;
  data?: Product; 
};

export async function addProduct(
  prevState: AddProductState, 
  formData: FormData 
): Promise<AddProductState> { 

  console.log('Server Action addProduct called with FormData');

  // 1. Extrahujeme dáta z FormData (vrátane nových polí)
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    image_url: formData.get('image_url'), 
    color_detail: formData.get('color_detail'),
    taste_detail: formData.get('taste_detail'),
    aroma_detail: formData.get('aroma_detail'),
    wine_type: formData.get('wine_type'),
    wine_region: formData.get('wine_region'),
    residual_sugar: formData.get('residual_sugar'),
    sugar_content_nm: formData.get('sugar_content_nm'),
    volume: formData.get('volume'),
    storage_temp: formData.get('storage_temp'),
    serving_temp: formData.get('serving_temp'),
    batch_number: formData.get('batch_number'),
    allergens: formData.get('allergens'),
    alcohol_content: formData.get('alcohol_content'),
    producer: formData.get('producer'),
    bottler: formData.get('bottler'),
    country_of_origin: formData.get('country_of_origin'),
    ean_link: formData.get('ean_link'),
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

  // 3. Vytvorenie Supabase klienta
  const supabase = createClient(); 

  // 4. Vloženie do databázy (vrátane nových polí)
  const { data: insertedData, error } = await supabase
    .from('products')
    .insert([
      {
        ...validatedFields.data, 
        description: validatedFields.data.description || null,
        category: validatedFields.data.category || null,
        image_url: validatedFields.data.image_url || null,
        color_detail: validatedFields.data.color_detail || null,
        taste_detail: validatedFields.data.taste_detail || null,
        aroma_detail: validatedFields.data.aroma_detail || null,
        wine_type: validatedFields.data.wine_type || null,
        wine_region: validatedFields.data.wine_region || null,
        residual_sugar: validatedFields.data.residual_sugar || null,
        sugar_content_nm: validatedFields.data.sugar_content_nm || null,
        volume: validatedFields.data.volume || null,
        storage_temp: validatedFields.data.storage_temp || null,
        serving_temp: validatedFields.data.serving_temp || null,
        batch_number: validatedFields.data.batch_number || null,
        allergens: validatedFields.data.allergens || null,
        alcohol_content: validatedFields.data.alcohol_content || null,
        producer: validatedFields.data.producer || null,
        bottler: validatedFields.data.bottler || null,
        country_of_origin: validatedFields.data.country_of_origin || null,
        ean_link: validatedFields.data.ean_link || null,
      },
    ])
    .select() 
    .single(); 

  // 5. Spracovanie výsledku
  if (error) {
    console.error('Supabase Insert Error:', error);
    return {
      error: `Chyba pri ukladaní produktu do databázy: ${error.message}`,
      success: false, 
      fieldErrors: undefined,
    };
  }

  console.log('Product inserted successfully:', insertedData);

  // 6. Revalidácia cesty
  revalidatePath('/admin/produkty'); 
  revalidatePath('/'); 

  // 7. Vrátime úspešný stav s vloženými dátami
  return { success: true, data: insertedData }; 
}

// Typ pre stav mazania (voliteľné, pre prípad použitia useFormState)
export type DeleteProductState = {
  success: boolean;
  error?: string | null;
};

export async function deleteProduct(
  // prevState: DeleteProductState, 
  formData: FormData 
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

    if (fetchError && fetchError.code !== 'PGRST116') { 
      console.error('Error fetching product image URL before delete:', fetchError);
      return { success: false, error: 'Chyba pri hľadaní produktu pred mazaním.' };
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
        const imageUrl = productData.image_url;
        const bucketName = 'product-images'; 
        const filePath = imageUrl.substring(imageUrl.indexOf(`/${bucketName}/`) + `/${bucketName}/`.length);

        if (filePath) {
          console.log(`Attempting to delete image from storage: ${filePath}`);
          const { error: deleteStorageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (deleteStorageError) {
            console.warn('Warning: Failed to delete product image from storage:', deleteStorageError);
          }
        }
      } catch (pathError) {
        console.warn('Warning: Could not parse file path from image_url for deletion:', pathError);
      }
    }

    // 4. Revalidácia cesty
    revalidatePath('/admin/produkty'); 
    revalidatePath('/'); 

    console.log(`Product with ID: ${productId} deleted successfully.`);
    return { success: true };

  } catch (e) {
    console.error('Unexpected error during product deletion:', e);
    return { success: false, error: 'Neočakávaná chyba počas mazania produktu.' };
  }
}

// Typ pre stav úpravy (podobný ako pri pridaní)
export type UpdateProductState = AddProductState; 

export async function updateProduct(
  prevState: UpdateProductState, 
  formData: FormData
): Promise<UpdateProductState> {
  const supabase = createClient();
  const productId = formData.get('productId') as string;
  const oldImageUrl = formData.get('oldImageUrl') as string | null; 

  if (!productId) {
    return { success: false, error: 'Chýba ID produktu pre úpravu.' };
  }

  console.log(`Server Action updateProduct called for ID: ${productId}`);

  let newImageUrl: string | null = oldImageUrl; 
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

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          newImageUrl = publicUrlData.publicUrl;
          uploadedNewFile = true;
          console.log('New image uploaded successfully:', newImageUrl);
        } else {
          console.error('Could not get public URL for uploaded image.');
          return { success: false, error: 'Nepodarilo sa získať URL nahraného obrázka.' };
        }
      } catch (uploadCatchError) {
        console.error('Unexpected error during image upload:', uploadCatchError);
        return { success: false, error: 'Neočakávaná chyba pri nahrávaní obrázka.' };
      }
    } else {
      console.log('Image file entry exists but is empty or invalid.');
      newImageUrl = null;
      uploadedNewFile = true; 
    }
  } else {
    console.log('No new image file submitted, keeping old image URL (if any).');
  }

  // 2. Extrahujeme a validujeme ostatné dáta
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    image_url: formData.get('image_url'), 
    color_detail: formData.get('color_detail'),
    taste_detail: formData.get('taste_detail'),
    aroma_detail: formData.get('aroma_detail'),
    wine_type: formData.get('wine_type'),
    wine_region: formData.get('wine_region'),
    residual_sugar: formData.get('residual_sugar'),
    sugar_content_nm: formData.get('sugar_content_nm'),
    volume: formData.get('volume'),
    storage_temp: formData.get('storage_temp'),
    serving_temp: formData.get('serving_temp'),
    batch_number: formData.get('batch_number'),
    allergens: formData.get('allergens'),
    alcohol_content: formData.get('alcohol_content'),
    producer: formData.get('producer'),
    bottler: formData.get('bottler'),
    country_of_origin: formData.get('country_of_origin'),
    ean_link: formData.get('ean_link'),
  };

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
    const { data: updatedData, error } = await supabase
      .from('products')
      .update({
        ...productData, 
        image_url: newImageUrl, 
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Supabase Update Error:', error);
      if (error.code === 'PGRST116') { 
        return {
          error: `Produkt s ID ${productId} nebol nájdený pre aktualizáciu.`,
          success: false,
          fieldErrors: undefined,
        };
      }
      return {
        error: `Chyba pri aktualizácii produktu v databáze: ${error.message}`,
        success: false,
        fieldErrors: undefined,
      };
    }

    // 4. Ak bol nahraný nový obrázok a starý existoval, zmažeme starý obrázok
    if (uploadedNewFile && oldImageUrl) {
      try {
        const bucketName = 'product-images'; 
        const oldFilePath = new URL(oldImageUrl).pathname.split(`/${bucketName}/`)[1];
        if (oldFilePath) {
          console.log(`Deleting old image from storage: ${oldFilePath}`);
          const { error: deleteStorageError } = await supabase.storage
            .from(bucketName)
            .remove([oldFilePath]);
          if (deleteStorageError) {
            console.warn('Warning: Failed to delete old product image from storage:', deleteStorageError);
          }
        }
      } catch (pathError) {
        console.warn('Warning: Could not parse old file path from image_url for deletion:', pathError);
      }
    }

    // 5. Revalidácia cesty
    revalidatePath('/admin/produkty');
    revalidatePath(`/admin/produkty/edit/${productId}`); 
    revalidatePath('/');

    console.log(`Product with ID: ${productId} updated successfully.`);
    return { success: true, data: updatedData };
  } catch (e) {
    console.error('Unexpected error during product update:', e);
    return { success: false, error: 'Neočakávaná chyba počas úpravy produktu.' };
  }
}
