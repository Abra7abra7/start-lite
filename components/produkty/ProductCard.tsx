'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url === null ? undefined : product.image_url,
    };

    try {
      if (itemToAdd.price === null || itemToAdd.price === undefined) {
        toast.error("Produkt nemá definovanú cenu a nemožno ho pridať do košíka.");
        return;
      }
      // Pridaj item toľkokrát, koľko je quantity
      for (let i = 0; i < quantity; i++) {
        addItem(itemToAdd);
      }
      toast.success(`${quantity}x ${product.name} ${quantity > 1 ? 'boli pridané' : 'bol pridaný'} do košíka.`);
      setQuantity(1); // Resetuj množstvo na 1 po pridaní
    } catch (error) {
      console.error("Chyba pri pridávaní do košíka:", error);
      toast.error("Nepodarilo sa pridať produkt do košíka.");
    }
  };

  const incrementQuantity = () => {
    const maxStock = typeof product.stock === 'number' ? product.stock : Infinity;
    // Uistíme sa, že neprekročíme maxStock, ak je definovaný
    if (typeof product.stock === 'number') {
        setQuantity(prev => Math.min(prev + 1, maxStock));
    } else {
        setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Minimum je 1
  };

  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  // Zmena: Kontrola, či je aktuálne množstvo MENŠIE ako zásoba
  const canIncreaseQuantity = typeof product.stock !== 'number' || quantity < product.stock;
  const stockAvailable = typeof product.stock === 'number' ? product.stock : null;

  return (
    <Card className="flex flex-col overflow-hidden h-full group border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 bg-white">
      <CardHeader className="p-0 relative"> {/* Pridané relative pre prípadné absolútne prvky nad obrázkom */} 
        <Link href={`/produkty/${product.id}`} className="block">
          <div className="relative w-full aspect-square overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name ?? 'Produkt'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                Žiadny obrázok
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/produkty/${product.id}`} className="block mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[2.5em] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-bold mb-2">{product.price ? `${product.price.toFixed(2)} €` : 'Cena neuvedená'}</p>
        <div className="mb-3"> 
          {isOutOfStock ? (
            <Badge variant="destructive">Vypredané</Badge>
          ) : stockAvailable !== null ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Skladom ({stockAvailable} ks)</Badge>
          ) : (
            <Badge variant="secondary">Dostupnosť neznáma</Badge>
          )}
        </div>
        {/* Miesto pre krátky popis, ak je potrebný */} 
        {/* <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{product.description}</p> */} 
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-2 border-t border-gray-100">

        {/* Riadok 1: Množstvo a Košík (alebo Vypredané) */} 
        <div className="flex items-center justify-between w-full gap-2">
          {isOutOfStock ? (
            <Button variant="outline" disabled className="w-full cursor-not-allowed">Vypredané</Button>
          ) : (
            <>
              {/* Kompaktný counter množstva */} 
              <div className="flex items-center border rounded-md shrink-0">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 rounded-r-none" 
                   onClick={decrementQuantity} 
                   disabled={quantity <= 1}
                   aria-label="Znížiť množstvo"
                 > 
                   <Minus size={16}/> 
                 </Button>
                 <span className="px-3 text-sm font-medium tabular-nums" aria-live="polite">{quantity}</span>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 rounded-l-none" 
                   onClick={incrementQuantity} 
                   disabled={!canIncreaseQuantity}
                   aria-label="Zvýšiť množstvo"
                 > 
                   <Plus size={16}/> 
                 </Button>
              </div>
              {/* Tlačidlo Do košíka */} 
              <Button 
                size="sm" 
                onClick={handleAddToCart} 
                disabled={product.price === null} 
                className="flex-grow min-w-[80px]"
                aria-label="Pridať do košíka"
              >
                <ShoppingCart size={16} className="mr-1 sm:mr-2"/>
                <span className="hidden sm:inline">Do košíka</span>
              </Button>
            </>
          )}
        </div>

        {/* Riadok 2: Detail */} 
        <Link href={`/produkty/${product.id}`} className="w-full">
           <Button variant="secondary" className="w-full">Detail produktu</Button>
        </Link>

      </CardFooter>
    </Card>
  );
}
