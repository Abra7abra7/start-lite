'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Helper pre podmienené triedy

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (category) {
      // Set the new category param
      current.set('category', category);
    } else {
      // Remove the category param for "All"
      current.delete('category');
    }

    // Ensure page starts from 1 when category changes? Optional.
    // current.delete('page'); 

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
       <Button
        variant={!currentCategory ? "secondary" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange(null)} // null represents "All"
        className={cn(
          "rounded-full",
          !currentCategory && "font-semibold"
        )}
      >
        Všetky
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "secondary" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category)}
          className={cn(
            "rounded-full capitalize", // Capitalize category names for display
            currentCategory === category && "font-semibold"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
