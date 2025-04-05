'use client';

import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner"; // Assuming you might want notifications later

interface ProductAddToCartProps {
    product: Omit<CartItem, 'quantity'>; // Pass product data needed for cart item
    stock: number;
}

export function ProductAddToCart({ product, stock }: ProductAddToCartProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (stock > 0) {
            addItem(product);
            // Optional: Show a success toast notification
            toast.success(`${product.name} added to cart!`);
        } else {
             toast.error("This product is out of stock.");
        }
    };

    return (
        <Button
            size="lg"
            disabled={stock <= 0}
            onClick={handleAddToCart}
        >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
    );
}
