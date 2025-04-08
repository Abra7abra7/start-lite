// components/admin/RecentOrders.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns'; // Na formátovanie relatívneho času
import { sk } from 'date-fns/locale'; // Slovenská lokalizácia pre date-fns

// Typ importovaný alebo definovaný tu (rovnaký ako v actions)
import { Database } from '@/lib/database.types';
// Typ upravený - bez emailu
type OrderWithProfile = Database['public']['Tables']['orders']['Row'] & {
    profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name'> | null;
};

// Funkcia na formátovanie meny (môže byť presunutá do zdieľaného utils)
const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(value);
};

// Funkcia na získanie farby pre status badge
const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'outline';
     case 'completed':
     case 'shipped': // Ak máš aj shipped
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

interface RecentOrdersProps {
  orders: OrderWithProfile[] | null;
  error?: string | null;
}

export function RecentOrders({ orders, error }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posledné objednávky</CardTitle>
        {/* Môže tu byť aj popisok alebo link na všetky objednávky */}
        {/* <CardDescription>Posledných 5 objednávok.</CardDescription> */}
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive">Chyba: {error}</p>}
        {!error && !orders?.length && <p className="text-sm text-muted-foreground">Zatiaľ žiadne objednávky.</p>}
        {!error && orders && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zákazník</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Suma</TableHead>
                <TableHead className="text-right">Dátum</TableHead>
                {/* Môžeme pridať stĺpec pre ID alebo link */}
                 <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">
                      {/* Opravená logika fallbacku - posledná možnosť je ID objednávky + oprava lint chyby */}
                      {order.profiles?.full_name
                        ? order.profiles.full_name // Ak je meno, zobraz ho
                        : order.user_id // Inak skontroluj user_id
                          ? `User ID: ${order.user_id.substring(0, 8)}...` // Ak je user_id, zobraz ho
                          // Prevedieme order.id na string pred substring()
                          : `Obj. ID: ${order.id.toString().substring(0, 8)}...` // Inak zobraz ID objednávky
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">
                      {order.status || 'Neznámy'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.total_price)}
                  </TableCell>
                   <TableCell className="text-right">
                    {order.created_at ? (
                      <span title={new Date(order.created_at).toLocaleString('sk-SK')}>
                         {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: sk })}
                      </span>
                     ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Link na detail objednávky (ak existuje stránka) */}
                    <Link href={`/admin/objednavky/${order.id}`} className="text-sm text-blue-600 hover:underline">
                        Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
