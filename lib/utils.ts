import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format currency
export function formatCurrency(amount: number | null, currency = 'EUR', locale = 'sk-SK') {
  if (amount === null) return 'N/A'; // Handle null input
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
