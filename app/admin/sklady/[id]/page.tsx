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
import { WarehouseActionsClient } from './_components/WarehouseActionsClient';
// Import typu pre inventár
import { InventoryItemWithProduct } from '@/lib/types';
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link
import { Pencil } from "lucide-react"; // Import Pencil

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

  const { name, inventory } = warehouseDetails;
  // Typovanie inventára pre odovzdanie do klienta
  const inventoryData: InventoryItemWithProduct[] = inventory || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-semibold">Detail Skladu: {name}</h1>
        <Button variant="outline" asChild>
          <Link href={`/admin/sklady/${warehouseId}/upravit`}>
            <Pencil className="mr-2 h-4 w-4" /> Upraviť sklad
          </Link>
        </Button>
      </div>

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
              {inventory.length > 0 ? (
                inventory.map(item => (
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

      {/* Odovzdanie warehouseId a inventoryData do klientského komponentu */}
      <WarehouseActionsClient warehouseId={warehouseId} inventoryData={inventoryData} />

    </div>
  );
}
