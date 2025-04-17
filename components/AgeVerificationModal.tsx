'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

export function AgeVerificationModal({
  isOpen,
  onConfirm,
  onDeny,
}: AgeVerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDeny()}> {/* Ak užívateľ zavrie dialóg inak ako tlačidlom, považujeme to za odmietnutie */}
      <DialogContent className="sm:max-w-[425px]"> {/* Odstránená vlastnosť hideCloseButton */}
        <DialogHeader>
          <DialogTitle>Overenie veku</DialogTitle>
          <DialogDescription>
            Pre vstup do obchodu musíte potvrdiť, že máte viac ako 18 rokov.
            Konzumácia alkoholu osobami mladšími ako 18 rokov je zakázaná.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-between w-full">
          <Button variant="outline" onClick={onDeny} className="w-full sm:w-auto mb-2 sm:mb-0">
            Nemám 18 rokov
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto bg-putec-primary hover:bg-putec-primary/90 text-primary-foreground">
            Mám 18+ rokov
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
