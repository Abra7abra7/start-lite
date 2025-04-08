import React from 'react';
// Pridané importy
import { getProductCount, getWarehouseCount, getRevenueStats, getPendingOrderCount, getRecentOrders } from './_actions';
import { StatCard } from '@/components/admin/StatCard';
// Pridaná ikona ShoppingCart
import { Package, Home, Euro, ShoppingCart } from 'lucide-react';
// Import nového komponentu
import { RecentOrders } from '@/components/admin/RecentOrders';


export const dynamic = 'force-dynamic';

const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(value);
};


export default async function AdminDashboardPage() {
  // Súbežné načítanie všetkých dát
  const [
      productResult,
      warehouseResult,
      revenueResult,
      pendingOrderResult, // Výsledok pre nevybavené obj.
      recentOrdersResult // Výsledok pre posledné obj.
    ] = await Promise.all([
    getProductCount(),
    getWarehouseCount(),
    getRevenueStats(),
    getPendingOrderCount(), // Volanie novej akcie
    getRecentOrders(5)   // Volanie novej akcie (limit 5)
  ]);

  const revenueData = revenueResult.data;
  const revenueError = revenueResult.error;


  return (
    // Hlavný kontajner s väčším gapom
    <div className="flex flex-col gap-8"> {/* Zväčšený gap */}
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Mriežka pre StatCard */}
       {/* Upravená mriežka pre 6 kariet - napr. 3 stĺpce */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"> {/* Upravené grid cols */}
        <StatCard
          title="Celkový počet produktov"
          value={productResult.count}
          icon={Package}
          error={productResult.error}
        />
        <StatCard
          title="Celkový počet skladov"
          value={warehouseResult.count}
          icon={Home}
          error={warehouseResult.error}
        />
         {/* Karta pre nevybavené objednávky */}
        <StatCard
          title="Nevybavené objednávky"
          value={pendingOrderResult.count}
          icon={ShoppingCart} // Ikona košíka
          error={pendingOrderResult.error}
        />
        {/* Karty pre tržby */}
        <StatCard
          title="Tržby dnes"
          value={formatCurrency(revenueData?.daily)}
          icon={Euro}
          error={revenueError}
        />
        <StatCard
          title="Tržby tento týždeň"
          value={formatCurrency(revenueData?.weekly)}
          icon={Euro}
          error={revenueError}
        />
        <StatCard
          title="Tržby tento mesiac"
          value={formatCurrency(revenueData?.monthly)}
          icon={Euro}
          error={revenueError}
        />
      </div>

      {/* Sekcia pre posledné objednávky */}
      <div> {/* Obalenie RecentOrders pre lepšiu štruktúru */}
         <RecentOrders orders={recentOrdersResult.data} error={recentOrdersResult.error} />
      </div>


      {/* Zobrazenie chýb (ak je relevantné) */}
      {revenueError && !revenueData && (
          <p className="text-sm text-destructive">Chyba pri načítaní štatistík tržieb: {revenueError}</p>
      )}
       {pendingOrderResult.error && pendingOrderResult.count === null && (
           <p className="text-sm text-destructive">Chyba pri načítaní počtu nevybavených objednávok: {pendingOrderResult.error}</p>
       )}
        {/* Chyba pre recent orders sa zobrazuje priamo v komponente */}


      <p>Vitajte v administrátorskom rozhraní.</p>

    </div>
  );
}
