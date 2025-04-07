import { Product } from "@/types/product"; // Importujeme typ produktu
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
               style={{ objectFit: 'contain' }} // contain or cover, depending on preference
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
              {product.category && (
                <Badge variant="secondary" className="whitespace-nowrap mt-1">{product.category}</Badge>
              )}
            </div>
            {product.description && (
              <CardDescription className="pt-2">{product.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-0 flex-grow">
            <div className="mb-4">
               <p className="text-xl font-semibold">{product.price ? `${product.price.toFixed(2)} €` : 'Cena na vyžiadanie'}</p>
               {/* Môžeme pridať info o sklade, ak ho máme */}
               {/* <p className="text-sm text-green-600">Skladom</p> */}
             </div>

            <dl className="space-y-1 border-t pt-4">
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
          </CardContent>

          <CardFooter className="p-0 pt-6 mt-auto">
            {/* TODO: Implementovať pridanie do košíka */}
            <Button className="w-full">Pridať do košíka</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
