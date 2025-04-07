'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { stripe } from '@/utils/stripe'; // Import Stripe klienta
import { type CheckoutFormData } from '@/lib/schemas'; // Import typu zo zdieľaného súboru

// TODO: Presunúť formSchema do zdieľaného súboru (napr. lib/schemas.ts), aby sa dalo importovať tu aj na stránke
type CartItem = { id: string; name: string; price: number; quantity: number, image_url?: string | null }; // Zjednodušený typ, prispôsobiť podľa CartContext

export async function createOrder(formData: CheckoutFormData, cartItems: CartItem[], totalPrice: number): Promise<{ success: boolean; error?: string; sessionId?: string; orderId?: string }> {
    const cookieStore = cookies();

    // Vytvorenie Supabase klienta pomocou @supabase/ssr
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                // Ďalšie metódy (set, remove) môžu byť potrebné pre iné operácie, 
                // ale pre select/insert by `get` malo stačiť.
                // set(name: string, value: string, options: CookieOptions) {
                //   cookieStore.set({ name, value, ...options });
                // },
                // remove(name: string, options: CookieOptions) {
                //   cookieStore.delete({ name, ...options });
                // },
            },
        }
    );

    console.log("Server Action: createOrder called");
    console.log("Form Data:", formData);
    console.log("Cart Items:", cartItems);
    console.log("Total Price:", totalPrice);

    try {
        // 2. TODO: Vypočítať finálnu cenu (vrátane dopravy, zliav atď.)
        const finalPrice = totalPrice; // Zatiaľ len základná cena
        const shippingCost = formData.deliveryMethod === 'courier' ? 5 : 0; // Príklad ceny dopravy
        const orderTotal = finalPrice + shippingCost;

        // 3. Vloženie objednávky do DB
        // Predpokladá existenciu tabuľky 'orders' a 'order_items'
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                // user_id: user?.id, // Ak chceme priradiť prihlásenému používateľovi
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                delivery_method: formData.deliveryMethod,
                street: formData.deliveryMethod === 'courier' ? formData.street : null,
                city: formData.deliveryMethod === 'courier' ? formData.city : null,
                zip_code: formData.deliveryMethod === 'courier' ? formData.zipCode : null,
                country: formData.deliveryMethod === 'courier' ? formData.country : null,
                billing_street: !formData.billingSameAsDelivery ? formData.billingStreet : null,
                billing_city: !formData.billingSameAsDelivery ? formData.billingCity : null,
                billing_zip_code: !formData.billingSameAsDelivery ? formData.billingZipCode : null,
                billing_country: !formData.billingSameAsDelivery ? formData.billingCountry : null,
                payment_method: formData.paymentMethod,
                total_price: orderTotal,
                shipping_cost: shippingCost,
                status: formData.paymentMethod === 'cod' ? 'pending_cod' : 'pending_payment', // Počiatočný status
                // Ďalšie potrebné polia...
            })
            .select()
            .single();

        if (orderError) {
            console.error('Supabase order insert error:', orderError);
            throw new Error('Nepodarilo sa uložiť objednávku do databázy.');
        }

        if (!orderData) {
            throw new Error('Nepodarilo sa získať ID vytvorenej objednávky.');
        }

        const orderId = orderData.id;
        console.log("Order created with ID:", orderId);

        // 4. Vloženie položiek objednávky do DB
        const orderItemsData = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.id, // Predpokladá, že item.id je ID produktu
            quantity: item.quantity,
            price_at_purchase: item.price, // Uložíme cenu v čase nákupu
            product_name: item.name, // Uložíme aj názov pre jednoduchšie zobrazenie
        }));

        const { error: orderItemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (orderItemsError) {
            console.error('Supabase order items insert error:', orderItemsError);
            // TODO: Zvážiť rollback / vymazanie už vytvorenej objednávky?
            throw new Error('Nepodarilo sa uložiť položky objednávky.');
        }

        console.log("Order items inserted for order ID:", orderId);

        // 5. Spracovanie platby
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Základná URL pre presmerovania

        if (formData.paymentMethod === 'stripe') {
            console.log("Processing Stripe payment...");

            // Zostavenie položiek pre Stripe
            const lineItems = cartItems.map(item => ({
                price_data: {
                    currency: 'eur', // Predpokladáme EUR
                    product_data: {
                        name: item.name,
                        // description: item.description, // Voliteľný popis
                        // images: item.image_url ? [item.image_url] : [], // Voliteľné obrázky
                    },
                    unit_amount: Math.round(item.price * 100), // Cena v centoch!
                },
                quantity: item.quantity,
            }));

            // Pridanie ceny dopravy ako samostatnej položky, ak je relevantná
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

            try {
                // Vytvorenie Stripe Checkout Session
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${siteUrl}/objednavka/dakujeme?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
                    cancel_url: `${siteUrl}/pokladna?canceled=true`,
                    customer_email: formData.email, // Prepojenie s emailom zákazníka
                    // Uloženie ID našej objednávky do metadát Stripe pre webhook
                    metadata: {
                        supabaseOrderId: orderId,
                    },
                });

                if (!session.id) {
                    throw new Error('Nepodarilo sa získať ID Stripe session.');
                }

                const sessionId = session.id;

                // TODO: Prípadne aktualizovať objednávku v DB so Stripe Session ID?
                // await supabase.from('orders').update({ stripe_session_id: sessionId }).eq('id', orderId);

                console.log("Stripe session created:", sessionId);
                // Košík sa vyčistí až po úspešnej platbe cez webhook
                return { success: true, sessionId: sessionId };

            } catch (stripeError) {
                console.error("Stripe session creation error:", stripeError);
                const message = stripeError instanceof Error ? stripeError.message : "Nastala chyba pri komunikácii so Stripe.";
                // TODO: Zvážiť rollback / aktualizáciu statusu objednávky v DB na 'payment_failed'?
                return { success: false, error: `Chyba pri vytváraní platby: ${message}` };
            }

        } else if (formData.paymentMethod === 'cod') {
            console.log("Processing COD order...");
            // Objednávka je už vytvorená so statusom 'pending_cod'
            // TODO: Poslať notifikačný email?
            // TODO: Vyčistiť košík
            return { success: true, orderId: orderId };
        }

        // Neočakávaný stav
        throw new Error('Neplatný spôsob platby.');

    } catch (error) {
        console.error("Error creating order:", error);
        const message = error instanceof Error ? error.message : "Nastala neočakávaná chyba pri vytváraní objednávky.";
        return { success: false, error: message };
    }
}
