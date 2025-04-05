import { createContext, useContext } from 'react';

// Define the shape of a cart item
export interface CartItem {
    id: string | number; // Product ID
    name: string;
    price: number;
    quantity: number;
    image_url?: string; // Optional image
}

// Define the shape of the Cart Context
export interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: string | number) => void;
    updateQuantity: (itemId: string | number, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
    isLoading: boolean; // Add isLoading flag
}

// Create the context with a default value (or null)
// We provide a default structure matching CartContextType but with placeholder functions
// This avoids errors when consuming the context before the provider is ready.
export const CartContext = createContext<CartContextType>({
    cartItems: [],
    addItem: () => console.warn('addItem function not yet implemented'),
    removeItem: () => console.warn('removeItem function not yet implemented'),
    updateQuantity: () => console.warn('updateQuantity function not yet implemented'),
    clearCart: () => console.warn('clearCart function not yet implemented'),
    getItemCount: () => 0,
    getTotalPrice: () => 0,
    isLoading: true, // Default isLoading to true
});

// Custom hook to use the Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
