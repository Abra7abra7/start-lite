// Pridaj 'use client' na začiatok, ak tam nie je,
// alebo refaktoruj AdminSidebarNav/Item do samostatného client komponentu.

// Vynútenie dynamického renderovania pre celú admin sekciu
export const dynamic = 'force-dynamic';

import Link from "next/link"; 
import { Package2 } from "lucide-react"; 
import { AdminNavItem } from "@/lib/types"; 
import { WarehouseSelectItem, getWarehousesForNav } from "./_actions/warehouseActions"; 
import { AdminSidebarNav } from "./_components/AdminSidebar"; 
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/actions'; 

// Definovanie navigačných položiek (statická časť)
const navItems: AdminNavItem[] = [ 
  {
    href: "/admin",
    label: "Prehľad",
    iconName: "Home",
  },
  {
    href: "/admin/objednavky",
    label: "Objednávky",
    iconName: "ShoppingCart",
  },
  {
    href: "/admin/produkty",
    label: "Produkty",
    iconName: "Package",
  },
  {
    href: "/admin/sklady",
    label: "Sklady",
    iconName: "Warehouse", 
    // subItems budú pridané dynamicky
  },
  // Odstránená pôvodná položka Používatelia
  // {
  //   href: '/admin/pouzivatelia',
  //   label: 'Používatelia',
  //   iconName: 'Users',
  // },
  {
    href: "/admin/zakaznici",
    label: "Zákazníci",
    iconName: "Users",
  },
  // Doplniť ďalšie položky podľa potreby
];

// --- Samotný Admin Layout (Server Component) ---
// Tento komponent NEMÔŽE mať 'use client'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  // Načítanie skladov pre navigáciu
  let finalNavItems: AdminNavItem[] = [...navItems]; 
  try {
    const { data: warehouses, error } = await getWarehousesForNav(); 

    if (error) {
      console.error("Chyba pri načítaní skladov pre navigáciu:", error);
    } else if (warehouses) {
      const warehousesNavItemIndex = finalNavItems.findIndex(item => item.href === "/admin/sklady");
      if (warehousesNavItemIndex !== -1) {
        finalNavItems[warehousesNavItemIndex] = {
          ...finalNavItems[warehousesNavItemIndex],
          subItems: warehouses.map((warehouse: WarehouseSelectItem) => ({
            href: `/admin/sklady/${warehouse.id}`,
            label: warehouse.name,
          }))
        };
        finalNavItems = [...finalNavItems];
      }
    }
  } catch (err: unknown) { 
    console.error("Neočekávaná chyba pri načítaní skladov:", err);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold"> 
              <Package2 className="h-6 w-6" />
              <span className="">Pútec Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <AdminSidebarNav items={finalNavItems} />
          </div>
          {/* Pridaná sekcia pre odhlásenie na spodok panela */}
          <div className="mt-auto p-4 border-t">
             <form action={logout}>
                <Button variant="ghost" className="w-full justify-start">
                   <LogOut className="mr-2 h-4 w-4" />
                    Odhlásiť sa
                </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
