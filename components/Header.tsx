import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { CartIcon } from './CartIcon'; // Import client component for cart icon

export async function Header() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const signOut = async () => {
        'use server';
        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect('/prihlasenie');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center max-w-screen-2xl">
                {/* TODO: Replace with actual logo */}
                <Link href="/" className="mr-6 flex items-center space-x-2">
                     <span className="font-bold sm:inline-block">
                         Vinárstvo Pútec
                     </span>
                </Link>

                <nav className="flex flex-1 items-center justify-end space-x-4">
                    {/* TODO: Add main navigation links (Products, About, etc.) later */}

                    {user ? (
                        <div className="flex items-center gap-4">
                             <span className="text-sm hidden sm:inline-block">Ahoj, {user.email}!</span>
                            <form action={signOut}>
                                <Button variant="outline" size="sm">Odhlásiť sa</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/prihlasenie">
                            <Button variant="outline" size="sm">Prihlásiť sa</Button>
                        </Link>
                    )}

                    {/* Cart Icon (Client Component) */}
                    <CartIcon />
                </nav>
            </div>
        </header>
    );
}
