'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast"; // Opravená cesta importu
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Import serverových akcií
import { createWarehouse, updateWarehouse } from '@/app/admin/_actions/warehouseActions';

// Definícia typu pre dáta skladu odovzdávané do formulára
interface WarehouseFormData {
  id: number;
  name: string;
  location: string | null;
}

// Schéma validácie
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Názov musí mať aspoň 2 znaky.",
  }),
  location: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof formSchema>;

// Props pre komponent
interface WarehouseFormProps {
  warehouseData?: WarehouseFormData; // Nepovinné - pre režim úpravy
}

export function WarehouseForm({ warehouseData }: WarehouseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Určenie, či sme v režime úpravy
  const isEditMode = !!warehouseData;

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(formSchema),
    // Nastavenie defaultných hodnôt - buď z warehouseData alebo prázdne
    defaultValues: {
      name: warehouseData?.name || "",
      location: warehouseData?.location || "",
    },
  });

  async function onSubmit(values: WarehouseFormValues) {
    setIsSubmitting(true);
    console.log(`Submitting warehouse form (${isEditMode ? 'edit' : 'create'}):`, values);

    if (isEditMode) {
      // Skontrolujeme, či warehouseData a jeho id existujú (pre TypeScript)
      if (!warehouseData?.id) {
        console.error("Warehouse ID is missing in edit mode.");
        toast({
          title: "Interná chyba formulára",
          description: "Chýba ID upravovaného skladu.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return; // Ukončíme onSubmit
      }

      const result = await updateWarehouse(warehouseData.id, values);

      setIsSubmitting(false);
      if (result.success) {
        toast({
          title: "Sklad úspešne upravený",
          description: `Zmeny v sklade "${values.name}" boli uložené.`,
        });
        router.push(`/admin/sklady/${warehouseData.id}`); // Návrat na detail skladu
        router.refresh();
      } else {
        toast({
          title: "Chyba pri úprave skladu",
          description: result.error || "Neznáma chyba servera.",
          variant: "destructive",
        });
      }

    } else {
      // Vytvorenie nového skladu (existujúca logika)
      const result = await createWarehouse(values);
      setIsSubmitting(false);

      if (result.success) {
        toast({
          title: "Sklad úspešne vytvorený",
          description: `Sklad "${values.name}" bol pridaný.`, // Konkrétnejšia správa
        });
        router.push('/admin/sklady'); // Presmerovanie na prehľad
        router.refresh(); // Obnovenie dát na stránke prehľadu
      } else {
        toast({
          title: "Chyba pri vytváraní skladu",
          description: result.error || "Neznáma chyba servera.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Názov skladu *</FormLabel>
              <FormControl>
                <Input placeholder="Napr. Hlavný sklad" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                Povinný názov skladu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokalita</FormLabel>
              <FormControl>
                {/* Správne ošetrenie null hodnoty pre input */}
                <Input placeholder="Napr. Bratislava, Rača" {...field} value={field.value ?? ''} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                Nepovinné umiestnenie skladu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? (isEditMode ? "Ukladám..." : "Vytváram...")
            : (isEditMode ? "Uložiť zmeny" : "Vytvoriť sklad")}
        </Button>
      </form>
    </Form>
  );
}
