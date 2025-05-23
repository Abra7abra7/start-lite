'use client'; // Označenie ako Client Component kvôli onClick handleru

import { Product } from "@/types/product"; // Importujeme typ produktu
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import pre Tabs
import { useCart } from "@/context/CartContext"; // Import hooku pre košík
import { toast } from "sonner"; // Import pre notifikácie
import Image from "next/image"; // Použijeme Next.js Image pre optimalizáciu
import { Button } from "@/components/ui/button"; // Pre tlačidlo "Pridať do košíka"
import { useState } from 'react'; // Import useState
import { ShoppingCart, Minus, Plus } from 'lucide-react'; // Import ikon

interface ProductDetailCardProps {
  product: Product;
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const isAccessory = product.category === "Príslušenstvo k vínu";

  // Pomocná funkcia na zobrazenie detailu len ak má hodnotu
  const renderDetail = (label: string, value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <div className="flex justify-between text-sm">
        <dt className="text-muted-foreground">{label}:</dt>
        <dd className="text-right">{value}</dd>
      </div>
    );
  };

  const { addItem } = useCart(); // Získanie funkcie addItem z kontextu
  const [quantity, setQuantity] = useState(1); // Stav pre množstvo

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

  // Pomocné premenné pre disabled stavy
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const hasPrice = product.price !== null && product.price !== undefined;
  // Zmena: Kontrola, či je aktuálne množstvo MENŠIE ako zásoba
  const canIncreaseQuantity = typeof product.stock !== 'number' || quantity < product.stock;
  const stockAvailable = typeof product.stock === 'number' ? product.stock : null;

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

  return (
    // Nový hlavný kontajner s gridom pre 2 stĺpce na md a vyššie
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      
      {/* --- Ľavý stĺpec: Obrázok --- */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-md border bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name || 'Obrázok produktu'}
            fill
            style={{ objectFit: 'contain' }} // contain zabezpečí viditeľnosť celého obrázka
            sizes="(max-width: 768px) 100vw, 50vw" // Upravené sizes pre layout
            priority // Priorita načítania pre LCP
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Obrázok nie je k dispozícii
          </div>
        )}
      </div>

      {/* --- Pravý stĺpec: Detaily a Akcie --- */}
      <div className="flex flex-col py-4 md:py-0">
        {/* Kategória (voliteľne, hore) */} 
        {product.category && (
           <Badge variant="secondary" className="whitespace-nowrap self-start mb-2">{product.category}</Badge>
         )}
         
        {/* Názov produktu */}
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-3">{product.name}</h1>

        {/* Cena a Sklad */}
        <div className="mb-6 flex items-baseline gap-4">
          <p className="text-2xl lg:text-3xl font-semibold text-primary">{hasPrice ? `${product.price?.toFixed(2)} €` : 'Cena na vyžiadanie'}</p>
          <div>
            {isOutOfStock ? (
              <Badge variant="destructive">Vypredané</Badge>
            ) : stockAvailable !== null ? (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Skladom ({stockAvailable} ks)</Badge>
            ) : (
              <Badge variant="secondary">Dostupnosť neznáma</Badge>
            )}
          </div>
        </div>
        
        {/* Akčná zóna: Množstvo a Košík */}
        {hasPrice && !isOutOfStock && (
          <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-md border">
             {/* Kompaktný counter množstva */} 
             <div className="flex items-center border rounded-md shrink-0 bg-white">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-r-none" 
                  onClick={decrementQuantity} 
                  disabled={quantity <= 1}
                  aria-label="Znížiť množstvo"
                > 
                  <Minus size={18}/> 
                </Button>
                <span className="px-4 text-base font-medium tabular-nums" aria-live="polite">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-l-none" 
                  onClick={incrementQuantity} 
                  disabled={!canIncreaseQuantity}
                  aria-label="Zvýšiť množstvo"
                > 
                  <Plus size={18}/> 
                </Button>
             </div>
             {/* Tlačidlo Do košíka - výraznejšie */}
             <Button 
               size="lg" // Väčšie tlačidlo
               onClick={handleAddToCart} 
               className="flex-grow"
               aria-label="Pridať do košíka"
             >
               <ShoppingCart size={20} className="mr-2"/>
               Pridať do košíka
             </Button>
           </div>
        )}
        {isOutOfStock && (
             <Button variant="outline" disabled className="w-full cursor-not-allowed mb-6">Vypredané</Button>
        )}
        {!hasPrice && (
             <Button variant="outline" disabled className="w-full cursor-not-allowed mb-6">Cena nie je dostupná</Button>
        )}

        {/* Tabs pre Popis a Parametre */}
        <Tabs defaultValue="popis" className="w-full mt-auto">
           <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="popis">Popis</TabsTrigger>
             <TabsTrigger value="parametre">Parametre</TabsTrigger>
           </TabsList>

           {/* Obsah pre záložku Popis */} 
           <TabsContent value="popis" className="mt-4">
             {product.description ? (
               <div className="prose prose-sm max-w-none text-muted-foreground">
                 <p>{product.description}</p>
               </div>
             ) : (
               <p className="text-sm text-muted-foreground italic">Popis nie je k dispozícii.</p>
             )}
           </TabsContent>

           {/* Obsah pre záložku Parametre */} 
           <TabsContent value="parametre" className="mt-4">
               <dl className="space-y-1">
                 {/* Detaily špecifické pre víno */} 
                 {!isAccessory && (
                   <>
                     {renderDetail("Farba", product.color_detail)}
                     {renderDetail("Chuť", product.taste_detail)}
                     {renderDetail("Vôňa", product.aroma_detail)}
                     {renderDetail("Typ vína", product.wine_type)}
                     {renderDetail("Región", product.wine_region)}
                     {renderDetail("Zvyškový cukor", product.residual_sugar)}
                     {renderDetail("Cukornatosť pri zbere", product.sugar_content_nm)}
                     {renderDetail("Objem", product.volume)}
                     {renderDetail("Teplota skladovania", product.storage_temp)}
                     {renderDetail("Teplota podávania", product.serving_temp)}
                     {renderDetail("Výrobná dávka", product.batch_number)}
                     {renderDetail("Alergény", product.allergens)}
                     {renderDetail("Alkohol", product.alcohol_content)}
                   </>
                 )}
                 {/* Všeobecné detaily (zobrazené vždy) */} 
                 {renderDetail("Výrobca", product.producer)}
                 {renderDetail("Plnič", product.bottler)}
                 {renderDetail("Krajina pôvodu", product.country_of_origin)}
                 {product.ean_link && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">EAN/Nutri:</dt>
                      <dd className="text-right">
                        <a href={product.ean_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                          Otvoriť odkaz
                        </a>
                      </dd>
                    </div>
                  )}
               </dl>
               {/* Zobrazenie, ak nie sú žiadne parametre (okrem potenciálnych všeobecných) */} 
               {!isAccessory && 
                  !product.color_detail && !product.taste_detail && !product.aroma_detail && 
                  !product.wine_type && !product.wine_region && !product.residual_sugar && 
                  !product.sugar_content_nm && !product.volume && !product.storage_temp && 
                  !product.serving_temp && !product.batch_number && !product.allergens && 
                  !product.alcohol_content && !product.producer && !product.bottler && 
                  !product.country_of_origin && !product.ean_link && 
                    <p className="text-sm text-muted-foreground italic">Žiadne parametre nie sú k dispozícii.</p>
                }
                {isAccessory && !product.producer && !product.bottler && !product.country_of_origin && !product.ean_link &&
                    <p className="text-sm text-muted-foreground italic">Žiadne parametre nie sú k dispozícii.</p>
                }
           </TabsContent>
         </Tabs>

      </div>
      
    </div>
  );
}
