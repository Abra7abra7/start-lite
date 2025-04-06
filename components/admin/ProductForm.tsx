'use client'; // This needs to be a client component for form handling

import React from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client'; // Import client-side Supabase client PRE UPLOAD OBRÁZKA
import { useFormState, useFormStatus } from 'react-dom'; // Pre prácu so Server Actions
import { addProduct, type ProductData } from '@/app/admin/produkty/actions'; // Importujeme Server Action
import { toast } from 'sonner'; // Import toast pre notifikácie (ak používaš shadcn/ui Sonner)

// Define the schema for form validation using Zod
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Názov musí mať aspoň 3 znaky." }),
  description: z.string().optional(), // Optional description
  price: z.coerce // Coerce input to number
    .number({
      required_error: "Cena je povinná.",
      invalid_type_error: "Cena musí byť číslo.",
    })
    .positive({ message: "Cena musí byť kladné číslo." }),
  stock: z.coerce // PRIDANÉ: Počet kusov na sklade
    .number({
        required_error: "Počet kusov je povinný.",
        invalid_type_error: "Počet kusov musí byť celé číslo.",
     })
    .int({ message: "Počet kusov musí byť celé číslo."}) // Ensure it's an integer
    .min(0, { message: "Počet kusov nemôže byť záporný." }),
  category: z.string().optional(),
  image: z.any().optional() // Using z.any() for simplicity with react-hook-form for FileList
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Komponent pre Submit tlačidlo, aby sme mohli zobraziť pending stav
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto"> {/* Pridané responzívne šírky */}
      {pending ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ukladá sa...
          </>
      ) : 'Uložiť produkt'}
    </Button>
  );
}


export default function ProductForm() {
  const supabase = createClient(); // Client-side Supabase len pre UPLOAD OBRÁZKA

  // Použijeme useFormState pre prácu so Server Action
  // Prvý argument je Server Action, druhý je počiatočný stav
  // Upravený initial state, aby zodpovedal očakávanému návratovému typu
  const initialState = { error: null, success: false, fieldErrors: null, data: null };
  const [state, formAction] = useFormState(addProduct, initialState);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0, // PRIDANÉ: Defaultná hodnota pre stock
      category: "",
      image: undefined, // Lepšie ako null pre file input
    },
  });

  // Efekt na zobrazenie toast notifikácií po skončení akcie
  React.useEffect(() => {
    if (state?.success) {
      toast.success('Produkt bol úspešne uložený!');
      form.reset(); // Reset formulára po úspešnom uložení
    } else if (state?.error) {
       // Zobrazíme všeobecnú chybu
       toast.error(`Chyba: ${state.error}`);
       // Zvýrazníme chybné polia (ak máme fieldErrors)
       if (state.fieldErrors) {
         Object.entries(state.fieldErrors).forEach(([fieldName, errors]) => {
           if (errors && errors.length > 0) {
             // react-hook-form neumožňuje priamo nastaviť chybu z externého zdroja jednoducho
             // v useFormState, lepšie je zobraziť chyby nad formulárom alebo cez toast
             console.error(`Field ${fieldName} error: ${errors.join(', ')}`);
             // Prípadne zobraziť detailnejšie chyby v toaste
             toast.error(`Chyba v poli ${fieldName}: ${errors.join(', ')}`);
             // Skusime nastaviť chybu aj do react-hook-form, aj keď to nemusí byť ideálne
             form.setError(fieldName as keyof ProductFormValues, {
                 type: 'server',
                 message: errors.join(', ')
             });
           }
         });
       }
    }
  }, [state, form]); // Pridaný form do závislostí

  // Zmenená onSubmit logika pre volanie Server Action
  async function onSubmit(values: ProductFormValues) {
    console.log("Form validated values:", values);

    let imageUrl: string | null = null;
    const imageFile = values.image && values.image.length > 0 ? values.image[0] : null;

    // 1. Upload image if selected (ostáva na klientovi)
    if (imageFile) {
      // Tu by mala byť zobrazená indikácia nahrávania obrázka
      toast.info('Nahrávam obrázok...');
      const fileExt = imageFile.name.split('.').pop();
      // Bezpečnejší názov súboru - napr. kombinácia user ID (ak je) a timestamp/random string
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`; // Path within the bucket

      console.log(`Attempting to upload ${filePath} to bucket product-images`);
      const { error: uploadError } = await supabase.storage
        .from('product-images') // Uisti sa, že bucket 'product-images' existuje a má správne politiky
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error(`Chyba pri nahrávaní obrázka: ${uploadError.message}`);
        return; // Stop submission if upload fails
      } else {
        // Construct the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        imageUrl = urlData?.publicUrl || null;
        console.log("Image uploaded successfully. Public URL:", imageUrl);
        toast.success('Obrázok úspešne nahraný.');
      }
    }

    // 2. Príprava dát pre Server Action
    // Musíme poslať dáta vo formáte, ktorý Server Action očakáva
    // Keďže voláme akciu manuálne, nemôžeme priamo použiť FormData.
    // Upravíme volanie formAction tak, aby prijalo náš objekt.
    // V actions.ts upravíme akciu, aby tieto dáta čítala.
    const productData: ProductData = {
      name: values.name,
      description: values.description || null,
      price: values.price,
      stock: values.stock, // Pridaný stock
      category: values.category || null,
      image_url: imageUrl, // Posielame URL získanú z uploadu
    };

    // 3. Volanie Server Action
    // Server Action `addProduct` teraz očakáva `(prevState, formData)`.
    // Keďže voláme manuálne, `formData` nebude automaticky vyplnené.
    // Musíme nájsť spôsob, ako odovzdať naše `productData`.
    // Riešenie: Predáme dáta ako súčasť `prevState` alebo ako samostatný argument, ak to useFormState umožňuje.
    // Najjednoduchšie je priamo zavolať Server Action funkciu, ale stratíme výhody useFormState pre pending/error handling.
    // Alternatíva: Použiť skrytý input alebo prispôsobiť Server Action.
    // Skúsime volať formAction, ale musíme zabezpečiť, aby dáta boli dostupné.
    // Hack: Predáme dáta cez FormData objekt manuálne.
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    console.log("Calling formAction with constructed FormData");
    formAction(formData); // Teraz by to malo fungovať s useFormState/useFormStatus

    // Reset a notifikácie sa riešia v React.useEffect na základe 'state'
  }

  // Použijeme handleSubmit z react-hook-form na validáciu, ale onSubmit logika je vlastná
  return (
    <Form {...form}>
      {/* Formulár teraz ODKAZUJE na serverovú akciu pomocou `action` prop,
          ale `onSubmit` z react-hook-form stále beží PRVÝ pre validáciu a upload. */}
      <form
        onSubmit={form.handleSubmit(onSubmit)} // Validácia a upload + manuálne volanie formAction
        className="space-y-8"
      >
        {/* Zobrazenie všeobecných chýb zo Server Action */}
         {state?.error && !state.fieldErrors && (
           <div className="text-sm text-red-600 p-3 bg-red-100 border border-red-400 rounded-md" role="alert">
             {state.error}
           </div>
         )}
         {/* Zobrazenie chýb polí (ak existujú) */}
         {/* Toto je zložitejšie integrovať priamo s FormField, zobrazíme ich hromadne hore */}
         {state?.fieldErrors && (
            <div className="text-sm text-red-600 p-3 bg-red-100 border border-red-400 rounded-md space-y-1" role="alert">
                <p className="font-medium">Prosím, opravte nasledujúce chyby:</p>
                <ul className="list-disc list-inside">
                    {Object.entries(state.fieldErrors).map(([field, errors]) =>
                        errors?.map((error, index) => (
                            <li key={`${field}-${index}`}>{field}: {error}</li>
                        ))
                    )}
                </ul>
            </div>
         )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Názov produktu</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Pesecká Leánka 2023" {...field} />
              </FormControl>
              <FormDescription>
                Hlavný názov produktu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Zadajte voliteľný popis produktu..."
                  className="resize-none" // Prevent manual resizing
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena (€)</FormLabel>
              <FormControl>
                {/* Use type="number" and step for better UX */}
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>
                Zadajte cenu produktu v EUR.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet kusov na sklade</FormLabel>
              <FormControl>
                {/* Uistíme sa, že hodnota je číslo pre input type=number */}
                <Input
                    type="number"
                    step="1"
                    min="0" // Validácia priamo v HTML
                    placeholder="0"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)} // Konvertujeme na číslo
                    value={field.value ?? 0} // Default hodnota pre zobrazenie
                />
              </FormControl>
              <FormDescription>
                Zadajte aktuálny počet kusov na sklade.
              </FormDescription>
              {/* Zobrazí chyby z Zod schémy + serverové chyby nastavené cez form.setError */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategória</FormLabel>
              <FormControl>
                {/* TODO: Consider using a Select component if categories are predefined */}
                <Input placeholder="Napr. Biele víno, Suché" {...field} />
              </FormControl>
              <FormDescription>
                Voliteľná kategória pre filtrovanie.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Input */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => ( // Destructure onChange etc.
            <FormItem>
              <FormLabel>Obrázok produktu</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" // Specify accepted types
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  onChange={(event) => {
                    // Get the FileList from the event
                    const fileList = event.target.files;
                    // Call the original onChange with the FileList
                    onChange(fileList); 
                  }}
                  {...rest} // Pass the rest of the field props
                 />
              </FormControl>
              <FormDescription>
                Nahrajte obrázok produktu (PNG, JPG, WEBP).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton />
      </form>
    </Form>
  );
}
