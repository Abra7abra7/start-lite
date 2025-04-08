'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom'; 
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct, type DeleteProductState } from "@/app/admin/produkty/actions";

interface DeleteProductButtonProps {
    productId: number;
    productName: string; // Pre potvrdenie
}

const initialState: DeleteProductState = {
    success: false,
    error: undefined,
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [state, formAction] = useFormState(deleteProduct, initialState);

    const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
        if (!confirm(`Naozaj chcete natrvalo zmazať produkt "${productName}"?`)) {
            event.preventDefault(); 
        }
    };

    return (
        <form action={formAction} onSubmit={handleDelete} style={{ display: 'inline-block' }}>
            <input type="hidden" name="productId" value={productId} />
            <SubmitButton />
            {state?.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
            {/* {state?.success && <p className="text-green-500 text-xs mt-1">Produkt zmazaný!</p>} */}
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
                <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-500 rounded-full"></span>
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}
