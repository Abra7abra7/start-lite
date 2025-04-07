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
// import { Textarea } from "@/components/ui/textarea"; // Odstránené - nepoužité
import { useToast } from "@/hooks/use-toast"; // Opravená cesta importu
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Import serverovej akcie na vytvorenie skladu
import { createWarehouse } from '@/app/admin/_actions/warehouseActions';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Názov musí mať aspoň 2 znaky.",
  }),
  location: z.string().optional(), // Lokácia je nepovinná
  // description: z.string().optional(), // Prípadný popis
});

type WarehouseFormValues = z.infer<typeof formSchema>;

export function WarehouseForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  async function onSubmit(values: WarehouseFormValues) {
    setIsSubmitting(true);
    console.log("Submitting warehouse form:", values);

    const result = await createWarehouse(values);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Sklad úspešne vytvorený",
        description: `Sklad "${values.name}" bol pridaný.`,
      });
      router.push('/admin/sklady');
      router.refresh();
    } else {
      toast({
        title: "Chyba pri vytváraní skladu",
        description: result.error || "Neznáma chyba servera.",
        variant: "destructive",
      });
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
          {isSubmitting ? "Vytváram..." : "Vytvoriť sklad"}
        </Button>
      </form>
    </Form>
  );
}
