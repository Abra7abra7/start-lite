import React from 'react';
import ProductForm from '@/components/admin/ProductForm'; // We will create this component next

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pridať nový produkt</h1>
      <ProductForm />
    </div>
  );
}
