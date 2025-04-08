'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { AdminNavItem as AdminNavItemType, AdminSubNavItem } from "@/lib/types"; 
import {
  Home,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  LucideIcon, 
} from "lucide-react";

// Mapa názvov ikon na komponenty
const iconMap: { [key: string]: LucideIcon } = {
  Home,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
};

// Hlavný komponent pre bočnú navigáciu
interface AdminSidebarNavProps {
  className?: string;
  items: AdminNavItemType[]; 
}

export function AdminSidebarNav({ items, className }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", className)}>
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <AdminSidebarNavItem
            key={item.href}
            {...item}
            isActive={isActive}
            currentPathname={pathname}
          />
        );
      })}
    </nav>
  );
}

// Komponent pre jednu položku v navigácii
interface AdminSidebarNavItemProps extends AdminNavItemType { 
  isActive: boolean;
  currentPathname: string;
}

function AdminSidebarNavItem({
  href,
  label,
  iconName, 
  isActive,
  subItems = [],
  currentPathname
}: AdminSidebarNavItemProps) {
  // Dynamicky získaj komponent ikony na základe mena
  const IconComponent = iconName ? iconMap[iconName] : null;

  return (
    <div>
      <Link
        key={`${href}-${label}`} 
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
          (currentPathname === href || (isActive && subItems.length === 0) || (isActive && subItems.some(sub => currentPathname === sub.href))) && "bg-muted text-primary"
        )}
      >
        {/* Vykresli ikonu, ak existuje */} 
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {label}
      </Link>
      {isActive && subItems && subItems.length > 0 && (
        <div className="ml-7 mt-1 flex flex-col gap-1 border-l border-muted-foreground/20 pl-3">
          {subItems.map((subItem: AdminSubNavItem) => { 
            const isSubItemActive = currentPathname === subItem.href;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-1 text-sm text-muted-foreground transition-all hover:text-primary",
                  isSubItemActive && "text-primary font-medium"
                )}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
