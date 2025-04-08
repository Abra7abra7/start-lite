"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteWarehouse } from "@/app/admin/_actions/warehouseActions";
import { toast } from "sonner"; // Zmenený import na sonner

interface WarehouseDeleteButtonProps {
  warehouseId: number;
  warehouseName: string;
  disabled?: boolean; // Prípadne pre zakázanie, ak má sklad zásoby (hoci to rieši aj backend)
}

export function WarehouseDeleteButton({
  warehouseId,
  warehouseName,
  disabled = false,
}: WarehouseDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWarehouse(warehouseId);
      if (result.success) {
        toast.success(`Sklad "${warehouseName}" bol úspešne odstránený.`); // Volanie toast z sonner
        setIsDialogOpen(false); // Zavrieť dialóg po úspechu
        // Revalidácia sa deje na serveri, nemusíme tu robiť nič ďalšie
      } else {
        toast.error(`Chyba pri odstraňovaní skladu`, { // Volanie toast.error z sonner s popisom
          description: result.error,
        });
      }
    });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Odstrániť sklad"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={disabled || isPending} // Zakázané ak je disabled alebo prebieha akcia
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Naozaj odstrániť sklad?</AlertDialogTitle>
          <AlertDialogDescription>
            Táto akcia je nezvratná. Naozaj chcete natrvalo odstrániť sklad
            <strong className="px-1">{warehouseName}</strong>?
            Sklad je možné odstrániť iba v prípade, že neobsahuje žiadne zásoby.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Zrušiť</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Odstraňujem..." : "Áno, odstrániť"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
