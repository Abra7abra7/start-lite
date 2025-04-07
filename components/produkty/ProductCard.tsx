'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, Minus, Plus } from 'lucide-react'; // Import ikon

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1); // Stav pre množstvo

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
    setQuantity(prev => Math.min(prev + 1, maxStock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Minimum je 1
  };

  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const canIncreaseQuantity = quantity < (typeof product.stock === 'number' ? product.stock : Infinity);

  return (
    <div className="group border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col transform hover:-translate-y-1 bg-white">
      {/* Obrázok produktu - Link na detail */}
      <Link href={`/produkty/${product.id}`} className="block">
        <div className="relative w-full h-48 overflow-hidden">
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

      {/* Detaily produktu pod obrázkom */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-1 truncate">
          {/* Názov produktu - Link na detail */}
          <Link href={`/produkty/${product.id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h2>
        {/* Krátky popis - voliteľne */}
        {/* <p className="text-gray-600 mb-3 text-sm line-clamp-2 flex-grow min-h-[40px]">{product.description || ""}</p> */}
        <p className="font-semibold text-base mb-2">{product.price ? `${product.price.toFixed(2)} €` : 'Cena neuvedená'}</p>

        {/* Zobrazenie dostupnosti */}
        <div className="mb-4 text-xs font-medium">
          {typeof product.stock === 'number' && product.stock > 0 ? (
            <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-800">
              Skladom ({product.stock} ks)
            </span>
          ) : isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800">
              Vypredané
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
              Dostupnosť neznáma
            </span>
          )}
        </div>

        {/* --- Kontajner pre Množstvo a Tlačidlá --- */}
        <div className="mt-auto pt-2">
          {/* --- Horný riadok: Množstvo + Pridať do košíka --- */}
          <div className="flex items-center gap-2 mb-2">
            {/* --- Tlačidlo Pridať do košíka (teraz vľavo) --- */}
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex-grow ${!isOutOfStock && product.price !== null ? '' : 'w-full'}`} // Stále flex-grow
              onClick={handleAddToCart}
              disabled={isOutOfStock || product.price === null}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isOutOfStock ? 'Vypredané' : 'Do košíka'}
            </Button>
            {/* --- Výber Množstva (teraz vpravo) --- */}
            {!isOutOfStock && product.price !== null && (
              <div className="flex items-center justify-center gap-1.5 shrink-0">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity} 
                  disabled={quantity <= 1}
                  aria-label="Znížiť množstvo"
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium text-base text-center w-8 tabular-nums px-1" aria-live="polite">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity} 
                  disabled={isOutOfStock || !canIncreaseQuantity}
                  aria-label="Zvýšiť množstvo"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* --- Dolný riadok: Detail --- */}
          <div className="mt-2"> 
            <Link href={`/produkty/${product.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                Detail
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
