import { WarehouseForm } from '../_components/WarehouseForm';

export default function NewWarehousePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vytvoriť nový sklad</h1>
      <WarehouseForm />
    </div>
  );
}
