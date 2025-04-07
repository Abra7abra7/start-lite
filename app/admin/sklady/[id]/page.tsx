import { notFound } from 'next/navigation';
import { getWarehouseDetails } from '@/app/admin/_actions/warehouseActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

interface WarehouseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WarehouseDetailPage({ params }: WarehouseDetailPageProps) {
  const warehouseId = parseInt(params.id, 10);

  if (isNaN(warehouseId)) {
    notFound(); // Zobrazí 404, ak ID nie je číslo
  }

  const { data: warehouseDetails, error } = await getWarehouseDetails(warehouseId);

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Chyba pri načítaní skladu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!warehouseDetails) {
    notFound(); // Alebo zobraziť vlastnú správu
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Detail Skladu: {warehouseDetails.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Inventár</CardTitle>
          <CardDescription>Aktuálny stav zásob v tomto sklade.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Kategória</TableHead>
                <TableHead className="text-right">Množstvo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouseDetails.inventory.length > 0 ? (
                warehouseDetails.inventory.map(item => (
                  <TableRow key={item.product_id}>
                    <TableCell className="font-medium">
                      {item.products ? item.products.name : `Produkt ID: ${item.product_id}`}
                    </TableCell>
                    <TableCell>{item.products?.category || '-'}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Sklad je prázdny.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pridanie sekcie s tlačidlami */}
      <div className="flex gap-2 mt-4">
        <Button>Príjem tovaru</Button>
        <Button variant="outline">Prevod tovaru</Button>
        {/* TODO: Implementovať funkčnosť tlačidiel */}
      </div>

    </div>
  );
}
