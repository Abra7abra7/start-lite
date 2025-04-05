'use client'; // This component uses hooks and interacts with localStorage

import React, { useState, useEffect, ReactNode } from 'react';
import { CartContext, CartItem, CartContextType } from '@/context/CartContext';

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state, default true

    // Load cart from localStorage on initial mount
    useEffect(() => {
        setIsLoading(true); // Ensure loading is true at the start
        try {
            const storedCart = localStorage.getItem('shoppingCart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            localStorage.removeItem('shoppingCart'); // Clear corrupted data
        } finally {
             setIsLoading(false); // Set loading to false after attempt
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Save cart to localStorage whenever it changes, BUT only after initial load
    useEffect(() => {
         if (!isLoading) { // Only save if not loading
             try {
                 localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
             } catch (error) {
                 console.error("Failed to save cart to localStorage:", error);
             }
         }
    }, [cartItems, isLoading]); // Add isLoading to dependency array

    const addItem = (itemToAdd: Omit<CartItem, 'quantity'>) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === itemToAdd.id);
            if (existingItem) {
                // Increase quantity if item already exists
                return prevItems.map(item =>
                    item.id === itemToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { ...itemToAdd, quantity: 1 }];
            }
        });
    };

    const removeItem = (itemId: string | number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string | number, quantity: number) => {
        setCartItems(prevItems => {
            // Prevent quantity less than 1
            const newQuantity = Math.max(1, quantity);
            return prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getItemCount = (): number => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getTotalPrice = (): number => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const value: CartContextType = {
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
        isLoading, // Add isLoading to context value
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
