import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // For displaying status
import Link from 'next/link'; // Import Link component
import { formatCurrency } from '@/lib/utils'; // Import shared function

// Helper function to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('sk-SK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
  } catch (e) {
    console.error("Error formatting date:", e); // Log the error
    return 'Neplatný dátum';
  }
}

// Helper function to get badge variant based on status
function getStatusVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
    switch (status?.toLowerCase()) {
        case 'pending':
        case 'spracováva sa':
            return 'secondary';
        case 'paid':
        case 'odoslaná':
            return 'default'; // Or maybe a success variant if you add one
        case 'failed':
        case 'zrušená':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default async function AdminObjednavkyPage() {
  const supabase = createClient();

  // Fetch orders - selecting specific columns is better practice
  // TODO: Select only necessary columns and potentially join with customer data if needed
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*') // Consider selecting specific columns: 'id, created_at, customer_email, total_amount, status'
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Chyba pri načítaní objednávok:", error);
    return <p className="text-red-500">Nastala chyba pri načítaní objednávok: {error.message}</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>Žiadne objednávky na zobrazenie.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Prehľad Objednávok</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Dátum</TableHead>
            <TableHead>Zákazník (Email)</TableHead>
            <TableHead className="text-right">Suma</TableHead>
            <TableHead>Stav</TableHead>
            {/* Add more heads if needed, e.g., for actions */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {/* Link to the order detail page */}
                <Link href={`/admin/objednavky/${order.id}`} className="hover:underline">
                  {String(order.id).substring(0, 8)}...
                </Link>
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{order.customer_email || 'N/A'}</TableCell> {/* Assuming customer_email exists */}
              <TableCell className="text-right">{formatCurrency(order.total_price)}</TableCell>
              <TableCell>
                 <Badge variant={getStatusVariant(order.status)}>{order.status || 'Neznámy'}</Badge>
              </TableCell>
               {/* Add action buttons cell if needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
