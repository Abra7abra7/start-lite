import { NextResponse, NextRequest } from 'next/server';
import { CartItem } from '@/context/CartContext'; // Assuming CartItem definition is here
import { getStripeClient } from '@/utils/stripe'; // Import the utility function

export async function POST(req: NextRequest) {
    const stripe = getStripeClient(); 
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000';

    try {
        // 1. Get Cart Items from Request Body
        const cartItems = await req.json() as CartItem[];

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Košík je prázdny.' }, { status: 400 });
        }

        // 2. Transform Cart Items into Stripe Line Items
        const line_items = cartItems.map((item: CartItem) => {
            // Ensure price is in cents (or smallest currency unit)
            const unitAmount = Math.round(item.price * 100);
            if (unitAmount < 50) { // Stripe minimum is typically €0.50 or $0.50
                 console.warn(`Item ${item.name} price ${item.price} is below Stripe minimum, adjusting to €0.50`);
                 // You might want to handle this differently, e.g., throw an error
                // unitAmount = 50;
                throw new Error(`Cena položky ${item.name} (€${item.price}) je pod minimálnym limitom Stripe (€0.50).`);
            }

            return {
                price_data: {
                    currency: 'eur', // Change if using a different currency
                    product_data: {
                        name: item.name,
                        // Add description or images if desired
                        // description: item.description,
                        // images: item.image_url ? [item.image_url] : [],
                    },
                    unit_amount: unitAmount, // Price in cents
                },
                quantity: item.quantity,
            };
        });

        // 3. Define Success and Cancel URLs (Using Slovak paths)
        const success_url = `${siteUrl}/objednavka/dakujeme?session_id={CHECKOUT_SESSION_ID}`;
        const cancel_url = `${siteUrl}/kosik?status=cancelled`; // Back to the cart

        // 4. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: success_url,
            cancel_url: cancel_url,
            // Optional: Add customer email, billing details, etc.
            // customer_email: userEmail, // If user is logged in
            // billing_address_collection: 'required',
            // shipping_address_collection: { allowed_countries: ['SK', 'CZ'] }, // Example
        });

        // 5. Return the Session ID
        if (session.url) {
            return NextResponse.json({ sessionId: session.id, url: session.url });
        } else {
             throw new Error('Stripe session URL not found');
        }

    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        // Check if error is an instance of Error to safely access message
        const errorMessage = error instanceof Error ? error.message : 'Nepodarilo sa vytvoriť platobnú reláciu.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
