import { createClient } from "@/lib/supabase/server";
import { 
    Table, 
    TableBody, 
    TableCaption, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

// Funkcia na získanie zákazníkov (profilov)
async function getCustomers() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*') // Získame všetky stĺpce z profilov
        .order('created_at', { ascending: false }); // Zoradíme podľa dátumu vytvorenia

    if (error) {
        console.error("Chyba pri načítaní zákazníkov:", error);
        return [];
    }
    return data;
}

export default async function AdminZakazniciPage() {
    const customers = await getCustomers();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Zákazníci</h1>
            <Table>
                <TableCaption>Zoznam všetkých registrovaných zákazníkov.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Meno</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tel. číslo</TableHead>
                        <TableHead>Dátum registrácie</TableHead>
                        {/* <TableHead>Rola</TableHead>  Môžeme pridať neskôr, ak máme roly */}
                        {/* <TableHead className="text-right">Akcie</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">Žiadni zákazníci nenájdení.</TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.full_name || 'Neznáme'}</TableCell>
                                <TableCell>{customer.email || 'Neznámy'}</TableCell>
                                <TableCell>{customer.phone_number || '-'}</TableCell>
                                <TableCell>
                                    {customer.created_at 
                                        ? format(new Date(customer.created_at), 'd. M. yyyy HH:mm', { locale: sk })
                                        : '-'}
                                </TableCell>
                                {/* <TableCell><Badge variant="secondary">{customer.role || 'Zákazník'}</Badge></TableCell> */}
                                {/* <TableCell className="text-right"> */}
                                    {/* TODO: Pridať tlačidlá na akcie (upraviť, zobraziť detaily...) */}
                                {/* </TableCell> */} 
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
