// components/admin/StatCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string | null | undefined; // Allow null/undefined for loading/error states
  icon?: LucideIcon;
  isLoading?: boolean; // Flag to show skeleton
  error?: string | null; // Error message
}

export function StatCard({ title, value, icon: Icon, isLoading = false, error = null }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" /> // Show Skeleton while loading
        ) : error ? (
            <div className="text-xs text-destructive font-semibold">Chyba: {error}</div>
        ) : (
          <div className="text-2xl font-bold">
            {value !== null && value !== undefined ? value : '-'} {/* Handle null/undefined */}
          </div>
        )}
        {/* Môžeme pridať aj popisok, napr. percentuálnu zmenu */}
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}
