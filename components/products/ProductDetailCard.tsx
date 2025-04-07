'use client'; // Označenie ako Client Component kvôli onClick handleru

import { Product } from "@/types/product"; // Importujeme typ produktu
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Odstránený CardDescription
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import pre Tabs
import Image from "next/image"; // Použijeme Next.js Image pre optimalizáciu
import { Button } from "@/components/ui/button"; // Pre tlačidlo "Pridať do košíka"

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

  const handleAddToCart = () => {
    // TODO: Implementovať skutočnú logiku pridania do košíka (napr. volanie serverovej akcie, context API)
    console.log(`Pridané do košíka: ${product.name} (ID: ${product.id})`);
    // Sem môže prísť napr. zobrazenie notifikácie (toast)
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        {/* Obrázok */}
        {product.image_url && (
           <div className="md:w-1/3 relative aspect-square md:aspect-auto">
             <Image
               src={product.image_url}
               alt={product.name || 'Obrázok produktu'}
               fill // Use fill for responsive images within the container
               style={{ objectFit: 'cover' }} // Zmenené na 'cover' - oreže obrázok, aby vyplnil priestor
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optional: Sizes for optimization
               priority // Prioritize loading if it's above the fold
             />
           </div>
         )}

        {/* Obsah karty */}
        <div className="md:w-2/3 p-4 md:p-6 flex flex-col">
          <CardHeader className="p-0 mb-4">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
              {/* Kategória Badge */} 
              {product.category && (
                <Badge variant="secondary" className="whitespace-nowrap mt-1">{product.category}</Badge>
              )}
            </div>
            {/* Popis bol presunutý do CardContent */} 
          </CardHeader>

          <CardContent className="p-0 flex-grow">
            <div className="mb-4">
               <p className="text-xl font-semibold">{product.price ? `${product.price.toFixed(2)} €` : 'Cena na vyžiadanie'}</p>
               {/* Zobrazenie dostupnosti */}
               <div className="mt-2">
                {typeof product.stock === 'number' && product.stock > 0 ? (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800">
                    Skladom ({product.stock} ks)
                  </span>
                ) : typeof product.stock === 'number' && product.stock <= 0 ? (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-red-100 text-red-800">
                    Vypredané
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
                    Dostupnosť neznáma
                  </span>
                )}
              </div>
             </div>

            {/* --- Začiatok Tabs pre Popis a Parametre --- */}
            <Tabs defaultValue="popis" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="popis">Popis</TabsTrigger>
                <TabsTrigger value="parametre">Parametre</TabsTrigger>
              </TabsList>

              {/* Obsah pre záložku Popis */} 
              <TabsContent value="popis" className="mt-4">
                {/* --- Sekcia pre Popis produktu --- */} 
                {product.description && (
                  <div> {/* Odstránené mb-6, border-t, pt-4 z pôvodného divu */} 
                    <h3 className="text-lg font-semibold mb-2 sr-only">Popis produktu</h3> {/* sr-only, lebo názov je v Tab Trigger */} 
                    {/* Použitie prose pre lepšie formátovanie textu */} 
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {/* Tu by sa mohol text potenciálne spracovať, ak by obsahoval markdown/html */} 
                      <p>{product.description}</p> 
                    </div>
                  </div>
                )}
                {!product.description && <p className="text-sm text-muted-foreground italic">Popis nie je k dispozícii.</p>}
                {/* --- Koniec Sekcie pre Popis produktu --- */}
              </TabsContent>

              {/* Obsah pre záložku Parametre */} 
              <TabsContent value="parametre" className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 sr-only">Parametre produktu</h3> {/* sr-only */} 
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
                           <a href={product.ean_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                             Odkaz
                           </a>
                         </dd>
                       </div>
                     )}
                  </dl>
              </TabsContent>
            </Tabs>
            {/* --- Koniec Tabs --- */} 

          </CardContent>

          <CardFooter className="p-0 pt-6 mt-auto">
            {/* TODO: Implementovať pridanie do košíka */}
            <Button 
              className="w-full"
              onClick={handleAddToCart}
              disabled={typeof product.stock === 'number' && product.stock <= 0} // Disable ak je vypredané
            >
                {typeof product.stock === 'number' && product.stock <= 0 ? 'Vypredané' : 'Pridať do košíka'}
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
