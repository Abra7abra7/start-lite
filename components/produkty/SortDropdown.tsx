'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  defaultValue: string; // Current sort param like 'created_at,desc'
}

export function SortDropdown({ defaultValue }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname(); // Gets the current path, e.g., /produkty
  const searchParams = useSearchParams(); // Gets current search params

  const handleValueChange = (value: string) => {
    // Create new URLSearchParams based on current params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update the 'sort' parameter
    current.set('sort', value);

    // Convert to string
    const search = current.toString();
    // Create the new query string
    const query = search ? `?${search}` : "";

    // Push the new URL
    router.push(`${pathname}${query}`);
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Vyberte triedenie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at,desc">Najnovšie</SelectItem>
        <SelectItem value="price,asc">Cena: od najnižšej</SelectItem>
        <SelectItem value="price,desc">Cena: od najvyššej</SelectItem>
        <SelectItem value="name,asc">Názov: A-Z</SelectItem>
        <SelectItem value="name,desc">Názov: Z-A</SelectItem>
      </SelectContent>
    </Select>
  );
}
