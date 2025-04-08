"use client";

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom'; 
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct, type DeleteProductState } from "@/app/admin/produkty/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProductButtonProps {
    productId: number;
    productName: string; 
}

const initialState: DeleteProductState = {
    success: false,
    error: undefined,
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [state, formAction] = useFormState(deleteProduct, initialState);
    const { pending } = useFormStatus(); 

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    title="Zmazať"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Naozaj chcete zmazať tento produkt?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {/* Oprava úvodzoviek pomocou &quot; */}
                        Produkt &quot;<b>{productName}</b>&quot; bude natrvalo odstránený z databázy, vrátane jeho obrázka. Túto akciu nie je možné vrátiť späť.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                    <form action={formAction} style={{ display: 'inline-block' }}>
                        <input type="hidden" name="productId" value={productId} />
                        <AlertDialogAction asChild>
                            <Button 
                                type="submit" 
                                variant="destructive" 
                                disabled={pending} 
                                aria-disabled={pending}
                            >
                                {pending ? 'Mažem...' : 'Zmazať natrvalo'}
                            </Button>
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
                 {state?.error && (
                    <p className="text-red-600 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded">
                        Chyba: {state.error}
                    </p>
                 )}
            </AlertDialogContent>
        </AlertDialog>
    );
}
