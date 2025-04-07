import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/lib/utils'; // Import shared function
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Re-using helper functions (consider moving them to a shared utils file)
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
    } catch {
        return 'Neplatný dátum';
    }
}

function getStatusVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
    switch (status?.toLowerCase()) {
        case 'pending':
        case 'spracováva sa':
            return 'secondary';
        case 'paid':
        case 'zaplatená':
        case 'odoslaná':
            return 'default';
        case 'failed':
        case 'zrušená':
            return 'destructive';
        default:
            return 'outline';
    }
}

// Define the structure for order items AS RETURNED BY SUPABASE
// Adjust based on your 'order_items' table AND the select query
interface SupabaseOrderItem {
    id: number | string; // Or whatever the type of your primary key is
    product_name: string | null; // Assuming you store product name
    quantity: number | null;
    price_at_purchase: number | null; // Price per unit at the time of order (in cents)
    // Add other relevant fields like product_id, sku, etc.
}

// Define the structure for the order itself AS RETURNED BY SUPABASE
// Adjust based on your 'orders' table AND the select query
interface SupabaseOrder {
    id: number | string;        // Matches DB
    created_at: string | null;  // Matches DB
    email: string | null;       // Corrected from customer_email
    total_price: number | null; // Corrected from total_amount
    status: string | null;      // Matches DB
    // Shipping Address fields (split from shipping_address)
    street: string | null;
    city: string | null;
    zip_code: string | null;
    country: string | null;
    // Billing Address fields (split from billing_address)
    billing_street: string | null;
    billing_city: string | null;
    billing_zip_code: string | null;
    billing_country: string | null;
    order_items: SupabaseOrderItem[]; // Array of order items based on the relation
    // Add other fields like shipping_method, payment_intent_id, etc.
}

async function getOrderDetails(orderId: string): Promise<SupabaseOrder | null> {
    const supabase = createClient();

    // Fetch the main order details AND its items in one go
    // IMPORTANT: Adjust table and column names ('order_items', 'product_name', etc.)
    //            to match your actual Supabase schema!
    const { data, error } = await supabase
        .from('orders')
        // Corrected column names (email, total_price) and added individual address fields
        .select(`
            id,
            created_at,
            email,          
            total_price,    
            status,
            street,         
            city,           
            zip_code,       
            country,        
            billing_street, 
            billing_city,   
            billing_zip_code,
            billing_country,
            order_items (
                id,
                product_name,
                quantity,
                price_at_purchase
            )
        `)
        .eq('id', orderId)
        .single(); // We expect only one order for a given ID

    if (error) {
        console.error(`Chyba pri načítaní detailu objednávky ${orderId}:`, error);
        return null; // Or throw error if you prefer
    }

    // Now Supabase types should align better with our explicit SupabaseOrder type
    return data;
}


export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const orderId = params.id;
    const order = await getOrderDetails(orderId);

    if (!order) {
        notFound(); // Show 404 page if order not found
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <Link href="/admin/objednavky" className="text-sm text-gray-600 hover:underline">&larr; Späť na prehľad</Link>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Objednávka #{String(order.id).substring(0, 8)}...</CardTitle>
                            <CardDescription>Dátum: {formatDate(order.created_at)}</CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(order.status)}>{order.status || 'Neznámy'}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-1">Zákazník</h3>
                        <p>{order.email || 'Email neuvedený'}</p>
                    </div>

                    {/* Display Shipping Address Fields */}
                    {(order.street || order.city || order.zip_code || order.country) && (
                        <div>
                            <h3 className="font-semibold mb-1">Adresa Doručenia</h3>
                            <p className="text-sm">
                                {order.street}<br />
                                {order.zip_code} {order.city}<br />
                                {order.country}
                            </p>
                        </div>
                    )}

                    {/* Display Billing Address Fields (only if different from shipping) */}
                    {(order.billing_street || order.billing_city || order.billing_zip_code || order.billing_country) &&
                        (order.billing_street !== order.street || order.billing_city !== order.city || order.billing_zip_code !== order.zip_code || order.billing_country !== order.country) && (
                            <div>
                                <h3 className="font-semibold mb-1">Fakturačná Adresa</h3>
                                <p className="text-sm">
                                    {order.billing_street}<br />
                                    {order.billing_zip_code} {order.billing_city}<br />
                                    {order.billing_country}
                                </p>
                            </div>
                        )}

                    <div>
                        <h3 className="font-semibold mb-2">Položky Objednávky</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produkt</TableHead>
                                    <TableHead className="text-center">Množstvo</TableHead>
                                    <TableHead className="text-right">Cena/ks</TableHead>
                                    <TableHead className="text-right">Spolu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.order_items && order.order_items.length > 0 ? (
                                    order.order_items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.product_name || 'Neznámy produkt'}</TableCell>
                                            <TableCell className="text-center">{item.quantity ?? 'N/A'}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.price_at_purchase)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency((item.quantity ?? 0) * (item.price_at_purchase ?? 0))}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">Žiadne položky v objednávke.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end font-semibold">
                    Celková Suma: {formatCurrency(order.total_price)}
                </CardFooter>
            </Card>

            {/* Card for Order Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Zmeniť Stav Objednávky</CardTitle>
                    <CardDescription>Vyberte nový stav pre túto objednávku.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form> { /* TODO: Add Server Action */}
                        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                            <Select name="newStatus" defaultValue={order.status ?? undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Vyberte nový stav..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* TODO: Populate with possible statuses */}
                                    <SelectItem value="pending">Čaká na spracovanie</SelectItem>
                                    <SelectItem value="processing">Spracováva sa</SelectItem>
                                    <SelectItem value="shipped">Odoslaná</SelectItem>
                                    <SelectItem value="delivered">Doručená</SelectItem> 
                                    <SelectItem value="cancelled">Zrušená</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Uložiť Zmenu</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
