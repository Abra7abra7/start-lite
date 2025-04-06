'use client'; // This needs to be a client component for form handling

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; // useFormStatus patrí do react-dom
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from 'react-dom'; // Správny import pre useFormStatus
import { 
  addProduct, 
  updateProduct, 
  AddProductState, 
  UpdateProductState 
} from '@/app/admin/produkty/actions'; // Importujeme obe akcie a stavy
import { toast } from 'sonner';
import Image from 'next/image' // Použijeme Next.js Image pre náhľad
import { Trash2 } from "lucide-react"
import { Product } from "@/types/product"; // Import nového typu
import { Loader2 } from 'lucide-react'; // Pre indikátor načítania

// Zod schéma zostáva rovnaká pre add/edit, ale použijeme ju pre typovanie formulára
// Nepotrebujeme explicitne productId a oldImageUrl, tie pôjdu cez skryté polia
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Názov musí mať aspoň 3 znaky." }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: "Cena musí byť kladné číslo." }),
  stock: z.coerce.number().int().min(0, { message: "Sklad musí byť 0 alebo viac." }),
  category: z.string().optional(),
  imageFile: z.instanceof(File).optional(), // Len pre klientský upload
  // Nové polia v schéme
  color_detail: z.string().optional(),
  taste_detail: z.string().optional(),
  aroma_detail: z.string().optional(),
  wine_type: z.string().optional(),
  wine_region: z.string().optional(),
  residual_sugar: z.string().optional(),
  sugar_content_nm: z.string().optional(),
  volume: z.string().optional(),
  storage_temp: z.string().optional(),
  serving_temp: z.string().optional(),
  batch_number: z.string().optional(),
  allergens: z.string().optional(),
  alcohol_content: z.string().optional(),
  producer: z.string().optional(),
  bottler: z.string().optional(),
  country_of_origin: z.string().optional(),
  ean_link: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Nové props pre komponent
interface ProductFormProps {
  mode: 'add' | 'edit';
  initialData?: Product | null; // Typ produktu z databázy
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Inicializácia useFormState s príslušnou akciou
  const action = mode === 'add' ? addProduct : updateProduct;
  const initialState: AddProductState | UpdateProductState = { success: false };
  const [state, formAction] = useFormState<AddProductState | UpdateProductState, FormData>(action, initialState);

  // react-hook-form inicializácia
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      stock: initialData?.stock ?? 0, // Použijeme ?? pre prípad, že stock je 0
      category: initialData?.category || '',
      imageFile: undefined,
      // Nové polia - defaultné hodnoty
      color_detail: initialData?.color_detail || '',
      taste_detail: initialData?.taste_detail || '',
      aroma_detail: initialData?.aroma_detail || '',
      wine_type: initialData?.wine_type || '',
      wine_region: initialData?.wine_region || '',
      residual_sugar: initialData?.residual_sugar || '',
      sugar_content_nm: initialData?.sugar_content_nm || '',
      volume: initialData?.volume || '',
      storage_temp: initialData?.storage_temp || '',
      serving_temp: initialData?.serving_temp || '',
      batch_number: initialData?.batch_number || '',
      allergens: initialData?.allergens || '',
      alcohol_content: initialData?.alcohol_content || '',
      producer: initialData?.producer || '',
      bottler: initialData?.bottler || '',
      country_of_origin: initialData?.country_of_origin || '',
      ean_link: initialData?.ean_link || '',
    },
  });

  // Získanie pending stavu pre tlačidlo
  const { pending } = useFormStatus();

  // useEffect na spracovanie odpovede zo servera
  useEffect(() => {
    if (state?.success) {
      toast.success(mode === 'add' ? "Produkt úspešne pridaný!" : "Produkt úspešne upravený!");
      // Reset formulára po úspechu
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      // Prípadne presmerovanie, ak je potrebné
      // napr. router.push('/admin/produkty')
    } else if (state?.error) {
      toast.error(state.error);
      // Zobrazenie chýb pri poliach
      if (state.fieldErrors) {
        for (const [fieldName, errors] of Object.entries(state.fieldErrors)) {
          if (errors) {
            form.setError(fieldName as keyof ProductFormValues, {
              type: "server",
              message: errors.join(", "),
            });
          }
        }
      }
    }
  }, [state, form, mode]); // Zahrnutie form a mode do závislostí

  // Handler pre odoslanie
  const onSubmit = async (/*values: ProductFormValues*/) => {
    // Tento handler už nie je priamo potrebný, logika sa presunula do useFormState
    // Vytvoríme FormData manuálne, pretože react-hook-form má problémy s File inputom
    // priamo v spojení s useFormState
    const formData = new FormData();
    const values = form.getValues(); // Získame aktuálne hodnoty

    // Pridáme všetky polia do FormData
    Object.entries(values).forEach(([key, value]) => {
      // Check if the value is not undefined or null, and not the imageFile field
      if (key !== 'imageFile' && value !== undefined && value !== null) {
        // Ensure boolean false is converted to string 'false' if needed, although not applicable here
        // For empty strings from optional fields, append them as empty strings
        formData.append(key, String(value));
      }
    });

    // Pridáme súbor, ak bol vybraný
    if (imageFile) {
      formData.append('imageFile', imageFile);
    } else if (imagePreview && mode === 'edit') {
      // Ak editujeme a obrázok nebol zmenený, pošleme pôvodnú URL
      formData.append('image_url', imagePreview);
    }

    // Pridáme ID a starú URL pre editáciu
    if (mode === 'edit' && initialData) {
      formData.append('productId', initialData.id);
      if (initialData.image_url) {
        formData.append('oldImageUrl', initialData.image_url);
      }
    }

    // Teraz zavoláme formAction (z useFormState) s pripravenou FormData
    formAction(formData); // Volanie akcie bez argumentov
  };

  // Handler pre zmenu súboru
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(initialData?.image_url || null); // Vrátime pôvodný alebo null
    }
  };

  // Handler pre odstránenie obrázka
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Form {...form}>
      {/* Použijeme vlastný onSubmit handler, ktorý potom zavolá formAction */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Názov produktu</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Pútec Cabernet Sauvignon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis</FormLabel>
              <FormControl>
                <Textarea placeholder="Voliteľný popis produktu..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="19.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock Field */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet kusov na sklade</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategória</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Červené víno, Suché" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                Voliteľné, napr. typ vína, ročník...
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* color_detail Field */}
        <FormField
          control={form.control}
          name="color_detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail farby</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Iskrivá, zlatožltá farba..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* taste_detail Field */}
        <FormField
          control={form.control}
          name="taste_detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail chuti</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Plná, extraktívna chuť..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* aroma_detail Field */}
        <FormField
          control={form.control}
          name="aroma_detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail vône</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Intenzívna vôňa tropického ovocia..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* wine_type Field */}
        <FormField
          control={form.control}
          name="wine_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Druh vína</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Akostné, biele, polosuché" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* wine_region Field */}
        <FormField
          control={form.control}
          name="wine_region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vinohradnícka oblasť</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Malokarpatská" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* residual_sugar Field */}
        <FormField
          control={form.control}
          name="residual_sugar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zbytkový cukor</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 10 g/l" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* sugar_content_nm Field */}
        <FormField
          control={form.control}
          name="sugar_content_nm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cukornatosť pri zbere</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 22 NM" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* volume Field */}
        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objem</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 0,75 l" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* storage_temp Field */}
        <FormField
          control={form.control}
          name="storage_temp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teplota skladovania</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 10 – 12°C" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* serving_temp Field */}
        <FormField
          control={form.control}
          name="serving_temp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teplota podávania</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 10 – 12°C" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* batch_number Field */}
        <FormField
          control={form.control}
          name="batch_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Výrobná dávka</FormLabel>
              <FormControl>
                <Input placeholder="Napr. L.23" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* allergens Field */}
        <FormField
          control={form.control}
          name="allergens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergény</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Obsahuje siričitany" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* alcohol_content Field */}
        <FormField
          control={form.control}
          name="alcohol_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obsah alkoholu</FormLabel>
              <FormControl>
                <Input placeholder="Napr. 12%" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* producer Field */}
        <FormField
          control={form.control}
          name="producer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Výrobca</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Pútec s.r.o., ..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* bottler Field */}
        <FormField
          control={form.control}
          name="bottler"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plnič</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Pútec s.r.o." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* country_of_origin Field */}
        <FormField
          control={form.control}
          name="country_of_origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Krajina pôvodu</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Slovensko" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ean_link Field */}
        <FormField
          control={form.control}
          name="ean_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EAN / Nutričný odkaz</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="imageFile"
          render={({ /*field*/ }) => ( // field sa tu priamo nepoužije pre input type file
            <FormItem>
              <FormLabel>Obrázok produktu</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </FormControl>
              {imagePreview && (
                <div className="mt-4 relative w-32 h-32 border rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Náhľad obrázka" layout="fill" objectFit="cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {!imagePreview && mode === 'edit' && initialData?.image_url && (
                  <p className="text-sm text-muted-foreground mt-2">Pôvodný obrázok bude zachovaný.</p>
              )}
              <FormDescription>
                Vyberte obrázok pre produkt (nepovinné).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'edit' ? 'Uložiť zmeny' : 'Pridať produkt'}
        </Button>
      </form>
    </Form>
  );
}
