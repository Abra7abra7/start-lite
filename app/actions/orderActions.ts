'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types'; 
import { checkoutFormSchema, CheckoutFormData } from '@/lib/schemas'; 
import { CartItem } from '@/context/CartContext'; 
import { stripe } from '@/utils/stripe';
import Stripe from 'stripe';

type CreateOrderResult = 
  | { success: true; orderId: number; } 
  | { success: true; sessionId: string; } 
  | { success: false; error: string; }; 

export async function createOrder(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    orderTotal: number,
    shippingCost: number
): Promise<CreateOrderResult> {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options) {
                    cookieStore.delete({ name, ...options });
                },
            },
        }
    );

    const validationResult = checkoutFormSchema.safeParse(formData); 
    if (!validationResult.success) {
        console.error('Server-side validation failed:', validationResult.error.errors);
        return { success: false, error: "Nespravne vyplnené údaje formulára." };
    }

    if (!cartItems || cartItems.length === 0) {
        return { success: false, error: "Košík je prázdny." };
    }

    try {
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                delivery_method: formData.deliveryMethod,
                street: formData.deliveryMethod === 'courier' ? formData.street ?? null : null,
                city: formData.deliveryMethod === 'courier' ? formData.city ?? null : null,
                zip_code: formData.deliveryMethod === 'courier' ? formData.zipCode ?? null : null,
                country: formData.deliveryMethod === 'courier' ? formData.country ?? null : null,
                billing_street: !formData.billingSameAsDelivery ? formData.billingStreet ?? null : null,
                billing_city: !formData.billingSameAsDelivery ? formData.billingCity ?? null : null,
                billing_zip_code: !formData.billingSameAsDelivery ? formData.billingZipCode ?? null : null,
                billing_country: !formData.billingSameAsDelivery ? formData.billingCountry ?? null : null,
                payment_method: formData.paymentMethod,
                total_price: orderTotal, 
                shipping_cost: shippingCost, 
                status: formData.paymentMethod === 'cod' ? 'pending_cod' : 'pending_payment',
            })
            .select('id') 
            .single();

        if (orderError || !orderData) {
            console.error('Supabase order insert error:', orderError);
            return { success: false, error: `Nepodarilo sa vytvoriť objednávku v databáze: ${orderError?.message ?? 'Neznáma chyba'}` };
        }

        const orderId = orderData.id; 

        const orderItemsData = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.id, 
            quantity: item.quantity,
            price_at_purchase: item.price,
            product_name: item.name, 
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Supabase order items insert error:', itemsError);
            await supabase.from('orders').delete().match({ id: orderId });
            return { success: false, error: `Nepodarilo sa uložiť položky objednávky: ${itemsError.message}` };
        }

        if (formData.paymentMethod === 'cod') {
            console.log(`Objednávka ${orderId} (dobierka) úspešne vytvorená.`);
            return { success: true, orderId: orderId }; 

        } else if (formData.paymentMethod === 'stripe') { 
            console.log(`Vytváram Stripe session pre objednávku ${orderId}...`);

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name, 
                    },
                    unit_amount: Math.round(item.price * 100), 
                },
                quantity: item.quantity,
            }));

            if (shippingCost > 0) {
                lineItems.push({
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Doprava',
                        },
                        unit_amount: Math.round(shippingCost * 100),
                    },
                    quantity: 1,
                });
            }

            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const successUrl = `${siteUrl}/objednavka/dakujeme?session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${siteUrl}/pokladna?canceled=true`;

            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    customer_email: formData.email, 
                    metadata: {
                        supabaseOrderId: String(orderId), 
                    },
                });

                if (!session.id) {
                    console.error('Stripe session ID missing after creation');
                    await supabase.from('order_items').delete().match({ order_id: orderId });
                    await supabase.from('orders').delete().match({ id: orderId });
                    return { success: false, error: 'Nepodarilo sa získať ID platobnej relácie zo Stripe.' };
                }

                console.log(`Stripe session ${session.id} vytvorená pre objednávku ${orderId}.`);
                return { success: true, sessionId: session.id };

            } catch (stripeError: unknown) { 
                console.error('Stripe session creation error:', stripeError);
                await supabase.from('order_items').delete().match({ order_id: orderId });
                await supabase.from('orders').delete().match({ id: orderId });
                const message = stripeError instanceof Error ? stripeError.message : 'Neznáma chyba';
                return { success: false, error: `Chyba pri vytváraní Stripe platobnej relácie: ${message}` };
            }
        } else {
            await supabase.from('order_items').delete().match({ order_id: orderId });
            await supabase.from('orders').delete().match({ id: orderId });
            return { success: false, error: "Neznámy spôsob platby." };
        }

    } catch (error: unknown) { 
        console.error('Unexpected error in createOrder:', error);
        const message = error instanceof Error ? error.message : 'Neznáma chyba';
        return { success: false, error: `Nastala neočakávaná chyba: ${message}` };
    }
}
