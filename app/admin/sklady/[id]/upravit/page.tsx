import { notFound } from 'next/navigation';
import { WarehouseForm } from '@/app/admin/sklady/_components/WarehouseForm';
import { getWarehouseById } from '@/app/admin/_actions/warehouseActions'; // Nová akcia na načítanie dát
import { Separator } from '@/components/ui/separator';

interface EditWarehousePageProps {
  params: {
    id: string;
  };
}

export default async function EditWarehousePage({ params }: EditWarehousePageProps) {
  const warehouseId = parseInt(params.id, 10);

  // Validácia ID
  if (isNaN(warehouseId)) {
    notFound();
  }

  // Načítanie dát skladu
  const { data: warehouseData, error } = await getWarehouseById(warehouseId);

  if (error || !warehouseData) {
    console.error("Error fetching warehouse for edit:", error);
    // TODO: Zobraziť krajšiu chybovú hlášku používateľovi
    notFound(); // Alebo zobraziť chybovú stránku
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Upraviť sklad</h1>
        <p className="text-sm text-muted-foreground">
          Upravte údaje existujúceho skladu: {warehouseData.name}
        </p>
      </div>
      <Separator />
      {/* Neskôr predáme warehouseData do formulára */}
      <WarehouseForm warehouseData={warehouseData} />
    </div>
  );
}
