'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/app/admin/produkty/actions'; // Importujeme server action

interface DeleteProductButtonProps {
  productId: string;
  productName: string; // Pre potvrdenie
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  // Poznámka: Zatiaľ nepoužívame useFormState pre jednoduchosť,
  // ale mohli by sme ho pridať pre lepšiu spätnú väzbu.

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Naozaj chcete natrvalo zmazať produkt "${productName}"?`)) {
      event.preventDefault(); // Zastaví odoslanie formulára
    }
    // Ak používateľ potvrdí, formulár sa odošle a zavolá server action
  };

  return (
    <form action={deleteProduct as any} onSubmit={handleDelete} style={{ display: 'inline-block' }}> {/* Rýchla oprava typu */}
      <input type="hidden" name="productId" value={productId} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="ghost"
      size="icon"
      type="submit"
      className="text-red-500 hover:text-red-700"
      title="Zmazať"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-500 rounded-full"></span> // Jednoduchý spinner
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
