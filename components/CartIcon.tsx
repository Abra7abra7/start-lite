'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export function CartIcon() {
    const { getItemCount } = useCart();
    const itemCount = getItemCount();

    return (
        <Link href="/kosik" passHref> {/* Update link to Slovak path */}
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {itemCount}
                    </span>
                )}
                 <span className="sr-only">View shopping cart</span>
            </Button>
        </Link>
    );
}
