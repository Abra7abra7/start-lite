'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getProductsForSelect, ProductSelectItem } from '@/app/admin/_actions/productActions';
import { receiveStock, getOtherWarehousesForSelect, WarehouseSelectItem, transferStock, removeInventoryQuantity } from '@/app/admin/_actions/warehouseActions';
import { InventoryItemWithProduct } from '@/lib/types'; 

interface WarehouseActionsClientProps {
  warehouseId: number;
  inventoryData: InventoryItemWithProduct[]; 
}

export function WarehouseActionsClient({ warehouseId, inventoryData }: WarehouseActionsClientProps) { 
  // Stavy pre Príjem tovaru
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productsList, setProductsList] = useState<ProductSelectItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Stavy pre Prevod tovaru
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedTransferProductId, setSelectedTransferProductId] = useState<string | null>(null);
  const [selectedTargetWarehouseId, setSelectedTargetWarehouseId] = useState<string | null>(null);
  const [transferQuantity, setTransferQuantity] = useState<number | string>('');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferIsLoading, setTransferIsLoading] = useState(false);
  const [targetWarehouses, setTargetWarehouses] = useState<WarehouseSelectItem[]>([]);
  const [targetWarehousesLoading, setTargetWarehousesLoading] = useState(true);
  const [targetWarehousesError, setTargetWarehousesError] = useState<string | null>(null);

  // Stavy pre Vyskladnenie tovaru
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedRemoveProductId, setSelectedRemoveProductId] = useState<string | null>(null);
  const [quantityToRemove, setQuantityToRemove] = useState<number | string>('');
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removeIsLoading, setRemoveIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const { data, error } = await getProductsForSelect();
        if (error) {
          console.error("Chyba pri načítaní produktov:", error);
          setProductsError("Nepodarilo sa načítať produkty.");
        } else if (data) {
          setProductsList(data);
        }
      } catch (err) {
        console.error("Neočekávaná chyba pri volaní getProductsForSelect:", err);
        setProductsError("Nastala neočakávaná chyba.");
      }
      setProductsLoading(false);
    };

    fetchProducts();
  }, []);

  // Načítanie cieľových skladov pri štarte komponentu
  useEffect(() => {
    const fetchTargetWarehouses = async () => {
      setTargetWarehousesLoading(true);
      setTargetWarehousesError(null);
      try {
        const { data, error } = await getOtherWarehousesForSelect(warehouseId);
        if (error) {
          console.error("Chyba pri načítaní cieľových skladov:", error);
          setTargetWarehousesError("Nepodarilo sa načítať sklady.");
        } else if (data) {
          setTargetWarehouses(data);
        }
      } catch (err) {
        console.error("Neočekávaná chyba pri volaní getOtherWarehousesForSelect:", err);
        setTargetWarehousesError("Nastala neočakávaná chyba.");
      }
      setTargetWarehousesLoading(false);
    };

    fetchTargetWarehouses();
  }, [warehouseId]); 

  // Handler pre odoslanie Príjmu
  const handleReceiveSubmit = async () => {
    setError(null);
    if (!selectedProductId || !quantity || +quantity <= 0) {
      setError('Prosím, vyberte produkt a zadajte platné množstvo.');
      return;
    }

    setIsLoading(true);
    setError(null); 

    try {
      const result = await receiveStock(
        warehouseId,
        parseInt(selectedProductId), 
        +quantity 
      );

      if (result.success) {
        setIsReceiveDialogOpen(false); 
        setSelectedProductId(null); 
        setQuantity('');
        router.refresh(); 
        // TODO: Zobraziť toast notifikáciu o úspechu
      } else {
        setError(result.error ?? 'Neznáma chyba pri prijímaní tovaru.');
      }
    } catch (err) {
      console.error("Neočekávaná chyba pri volaní receiveStock:", err);
      setError('Nastala neočakávaná chyba na strane klienta.');
    }

    setIsLoading(false);
  };

  // Handler pre odoslanie Prevodu (zatiaľ len loguje)
  const handleTransferSubmit = async () => {
    setTransferError(null);
    if (!selectedTransferProductId || !selectedTargetWarehouseId || !transferQuantity || +transferQuantity <= 0) {
      setTransferError('Prosím, vyplňte všetky polia platnými hodnotami.');
      return;
    }

    const selectedInventoryItem = inventoryData.find(item => String(item.product_id) === selectedTransferProductId);
    if (!selectedInventoryItem || selectedInventoryItem.quantity < +transferQuantity) {
        setTransferError(`Nedostatočné množstvo na sklade (dostupné: ${selectedInventoryItem?.quantity ?? 0}).`);
        return;
    }

    setTransferIsLoading(true);
    try {
      const result = await transferStock(
        warehouseId,
        parseInt(selectedTransferProductId), 
        parseInt(selectedTargetWarehouseId), 
        +transferQuantity 
      );

      if (result.success) {
        setIsTransferDialogOpen(false); 
        setSelectedTransferProductId(null); 
        setSelectedTargetWarehouseId(null);
        setTransferQuantity('');
        router.refresh(); 
        // TODO: Zobraziť toast notifikáciu o úspechu
      } else {
        setTransferError(result.error ?? 'Neznáma chyba pri prenose tovaru.');
      }
    } catch (err) {
      console.error("Neočekávaná chyba pri volaní transferStock:", err);
      setTransferError('Nastala neočakávaná chyba na strane klienta.');
    }

    setTransferIsLoading(false);
  };

  // Handler pre odoslanie Vyskladnenia
  const handleRemoveSubmit = async () => {
    setRemoveError(null);
    if (!selectedRemoveProductId || !quantityToRemove || +quantityToRemove <= 0) {
      setRemoveError('Prosím, vyberte produkt a zadajte platné množstvo.');
      return;
    }

    const selectedInventoryItem = inventoryData.find(item => String(item.product_id) === selectedRemoveProductId);
    if (!selectedInventoryItem || selectedInventoryItem.quantity < +quantityToRemove) {
        setRemoveError(`Nedostatočné množstvo na sklade (dostupné: ${selectedInventoryItem?.quantity ?? 0}).`);
        return;
    }

    setRemoveIsLoading(true);
    try {
      const result = await removeInventoryQuantity(
        warehouseId,
        parseInt(selectedRemoveProductId), 
        +quantityToRemove 
      );

      if (result.success) {
        setIsRemoveDialogOpen(false);
        setSelectedRemoveProductId(null);
        setQuantityToRemove('');
        router.refresh(); 
        // TODO: Zobraziť toast notifikáciu o úspechu
      } else {
        setRemoveError(result.error ?? 'Neznáma chyba pri vyskladňovaní tovaru.');
      }
    } catch (err) {
      console.error("Neočekávaná chyba pri volaní removeInventoryQuantity:", err);
      setRemoveError('Nastala neočakávaná chyba na strane klienta.');
    }
    setRemoveIsLoading(false);
  };

  // Získanie maximálneho dostupného množstva pre vybraný produkt na PREVOD
  const maxTransferQuantity = inventoryData.find(item => String(item.product_id) === selectedTransferProductId)?.quantity ?? 0;

  // Získanie maximálneho dostupného množstva pre vybraný produkt na VYSKLADNENIE
  const maxRemoveQuantity = inventoryData.find(item => String(item.product_id) === selectedRemoveProductId)?.quantity ?? 0;

  return (
    <div className="flex gap-2 mt-4">
      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogTrigger asChild>
          <Button>Príjem tovaru</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Príjem tovaru do skladu</DialogTitle>
            <DialogDescription>
              Vyberte produkt a zadajte množstvo, ktoré chcete prijať.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Produkt
              </Label>
              <Select 
                onValueChange={setSelectedProductId} 
                value={selectedProductId ?? undefined} 
                disabled={productsLoading || productsError !== null}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={productsLoading ? "Načítavam produkty..." : productsError ? "Chyba načítania" : "Vyberte produkt..."} />
                </SelectTrigger>
                <SelectContent>
                  {productsList.length > 0 ? (
                    productsList.map((product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-products" disabled>
                      {productsLoading ? "-" : "Žiadne produkty na výber"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Množstvo
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                min="1"
              />
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Zrušiť</Button>
            </DialogClose>
            <Button type="button" onClick={handleReceiveSubmit} disabled={isLoading}>
              {isLoading ? 'Prijímam...' : 'Potvrdiť príjem'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialóg pre prevod tovaru */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Prevod tovaru</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Prevod tovaru zo skladu</DialogTitle>
            <DialogDescription>
              Vyberte produkt, cieľový sklad a množstvo na prevod.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Výber produktu z aktuálneho inventára */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transfer-product" className="text-right">
                Produkt
              </Label>
              <Select
                onValueChange={setSelectedTransferProductId}
                value={selectedTransferProductId ?? undefined}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Vyberte produkt na prevod..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.filter(item => item.quantity > 0).length > 0 ? (
                    inventoryData
                      .filter(item => item.quantity > 0) 
                      .map((item) => (
                        <SelectItem key={item.product_id} value={String(item.product_id)}>
                          {item.products?.name ?? `Produkt ID: ${item.product_id}`} (Skladom: {item.quantity})
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="no-stock" disabled>
                      Žiadne produkty na sklade na prevod
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Výber cieľového skladu */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target-warehouse" className="text-right">
                Do skladu
              </Label>
              <Select
                onValueChange={setSelectedTargetWarehouseId}
                value={selectedTargetWarehouseId ?? undefined}
                disabled={targetWarehousesLoading || targetWarehousesError !== null}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={targetWarehousesLoading ? "Načítavam sklady..." : targetWarehousesError ? "Chyba načítania" : "Vyberte cieľový sklad..."} />
                </SelectTrigger>
                <SelectContent>
                  {targetWarehouses.length > 0 ? (
                    targetWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                        {warehouse.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-warehouses" disabled>
                      {targetWarehousesLoading ? "-" : "Žiadne iné sklady"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Zadanie množstva */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transfer-quantity" className="text-right">
                Množstvo
              </Label>
              <Input
                id="transfer-quantity"
                type="number"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(e.target.value)}
                className="col-span-3"
                min="1"
                max={maxTransferQuantity > 0 ? maxTransferQuantity : undefined} 
                disabled={!selectedTransferProductId} 
              />
            </div>
            {/* Zobrazenie dostupného množstva pre informáciu */}
            {selectedTransferProductId && (
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Dostupné množstvo na prevod: {maxTransferQuantity}
              </p>
            )}

            {/* Zobrazenie chyby */}
            {transferError && <p className="text-sm text-destructive col-span-4 text-center">{transferError}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Zrušiť</Button>
            </DialogClose>
            <Button type="button" onClick={handleTransferSubmit} disabled={transferIsLoading}>
              {transferIsLoading ? 'Prevádzam...' : 'Potvrdiť prevod'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialóg pre vyskladnenie tovaru */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Vyskladniť tovar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Vyskladnenie tovaru zo skladu</DialogTitle>
            <DialogDescription>
              Vyberte produkt a zadajte množstvo na vyskladnenie.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Výber produktu z aktuálneho inventára */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-product" className="text-right">
                Produkt
              </Label>
              <Select
                onValueChange={setSelectedRemoveProductId}
                value={selectedRemoveProductId ?? undefined}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Vyberte produkt na vyskladnenie..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.filter(item => item.quantity > 0).length > 0 ? (
                    inventoryData
                      .filter(item => item.quantity > 0) 
                      .map((item) => (
                        <SelectItem key={item.product_id} value={String(item.product_id)}>
                          {item.products?.name ?? `Produkt ID: ${item.product_id}`} (Skladom: {item.quantity})
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="no-stock-remove" disabled>
                      Žiadne produkty na sklade
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Zadanie množstva */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remove-quantity" className="text-right">
                Množstvo
              </Label>
              <Input
                id="remove-quantity"
                type="number"
                value={quantityToRemove}
                onChange={(e) => setQuantityToRemove(e.target.value)}
                className="col-span-3"
                min="1"
                max={maxRemoveQuantity > 0 ? maxRemoveQuantity : undefined} 
                disabled={!selectedRemoveProductId} 
              />
            </div>
            {/* Zobrazenie dostupného množstva pre informáciu */}
            {selectedRemoveProductId && (
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Dostupné množstvo na vyskladnenie: {maxRemoveQuantity}
              </p>
            )}

            {/* Zobrazenie chyby */}
            {removeError && <p className="text-sm text-destructive col-span-4 text-center">{removeError}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Zrušiť</Button>
            </DialogClose>
            <Button type="button" onClick={handleRemoveSubmit} disabled={removeIsLoading} variant="destructive">
              {removeIsLoading ? 'Vyskladňujem...' : 'Potvrdiť vyskladnenie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
