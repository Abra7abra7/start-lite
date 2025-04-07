import { getWarehouses } from '../_actions/warehouseActions';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Aby sa stránka vždy načítala čerstvá

export default async function WarehousesPage() {
  const { data: warehouses, error } = await getWarehouses();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sklady</h1>
        {/* TODO: Tlačidlo na pridanie nového skladu */}
        {/* <Button asChild>
          <Link href="/admin/sklady/nove">
            <PlusCircle className="mr-2 h-4 w-4" /> Pridať sklad
          </Link>
        </Button> */}
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Chyba</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && warehouses && (
        <Card>
          <CardHeader>
            <CardTitle>Zoznam skladov</CardTitle>
            <CardDescription>
              Prehľad všetkých definovaných skladov. Kliknutím na názov zobrazíte detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Názov skladu</TableHead>
                  <TableHead className="text-right">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/sklady/${warehouse.id}`} className="hover:underline">
                          {warehouse.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/sklady/${warehouse.id}`}>
                            Zobraziť detail
                          </Link>
                        </Button>
                        {/* TODO: Pridať akcie ako Upraviť, Vymazať */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Nenašli sa žiadne sklady.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!error && !warehouses && (
        <Card>
          <CardContent className="pt-6">
            <p>Načítavam sklady...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
