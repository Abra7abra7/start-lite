// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient } from '@/utils/stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail } from '@/lib/email'; // Import našej novej funkcie (TypeScript nájde .tsx)
import { OrderConfirmationEmailProps } from '@/emails/OrderConfirmationEmail'; // Import len props, komponent sa použije v lib/email
// React import tu už nemusí byť potrebný, ak JSX tvoríme v lib/email.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is not defined for webhook.');
}

// Vytvorenie Supabase klienta len ak sú premenné definované
const supabaseAdmin: SupabaseClient | null = supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null;

const stripe = getStripeClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized for webhook.');
    return NextResponse.json({ error: 'Database connection error.' }, { status: 500 });
  }

  const buf = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig) {
      throw new Error('Missing stripe-signature header');
    }
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during webhook signature verification';
    console.error(`Error verifying webhook signature: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook signature verification failed: ${errorMessage}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);
      
      const supabaseOrderId = session.metadata?.supabaseOrderId;
      if (!supabaseOrderId) {
        console.error('Supabase Order ID missing in session metadata for session:', session.id);
        return NextResponse.json({ received: true, error: 'Missing supabaseOrderId in metadata' });
      }

      try {
        const { data, error } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'paid', 
            stripe_session_id: session.id, 
            payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null 
          })
          .eq('id', parseInt(supabaseOrderId))
          .select();

        if (error) {
          console.error(`Error updating order ${supabaseOrderId} to paid:`, error);
          return NextResponse.json({ received: true, error: `Failed to update order: ${error.message}` });
        }

        console.log(`Order ${supabaseOrderId} successfully updated to paid. Data:`, data);

        // Načítanie detailov objednávky pre email
        const { data: orderDetails, error: orderDetailsError } = await supabaseAdmin
          .from('orders')
          .select('id, first_name, last_name, email, created_at, total_price, shipping_cost')
          .eq('id', parseInt(supabaseOrderId))
          .single();

        if (orderDetailsError || !orderDetails) {
          console.error(`Error fetching order details for ${supabaseOrderId}:`, orderDetailsError);
          // Pokračujeme, aj keď sa nepodarí načítať detaily pre email, platba je spracovaná
        } else {
          const { data: orderItems, error: orderItemsError } = await supabaseAdmin
            .from('order_items')
            .select('product_name, quantity, price_at_purchase')
            .eq('order_id', orderDetails.id);

          if (orderItemsError) {
            console.error(`Error fetching order items for ${supabaseOrderId}:`, orderItemsError);
          } else {
            // Príprava dát pre emailovú šablónu
            const emailProps: OrderConfirmationEmailProps = {
              customerName: `${orderDetails.first_name || ''} ${orderDetails.last_name || ''}`.trim(),
              customerEmail: orderDetails.email,
              orderId: String(orderDetails.id),
              orderDate: new Date(orderDetails.created_at).toLocaleDateString('sk-SK'),
              totalAmount: `${(orderDetails.total_price / 100).toFixed(2)} €`, // Predpokladáme, že total_price je v centoch
              lineItems: orderItems.map(item => ({
                description: item.product_name,
                quantity: item.quantity,
                unitPrice: `${(item.price_at_purchase / 100).toFixed(2)} €`, // Predpokladáme, že cena je v centoch
                totalPrice: `${((item.quantity * item.price_at_purchase) / 100).toFixed(2)} €`,
              })),
              // shopName, shopAddress, shopUrl, logoUrl použijú defaultné hodnoty zo šablóny
            };
            
            // Pridanie dopravy ako položky, ak existuje
            if (orderDetails.shipping_cost > 0) {
                emailProps.lineItems.push({
                    description: 'Doprava',
                    quantity: 1,
                    unitPrice: `${(orderDetails.shipping_cost / 100).toFixed(2)} €`,
                    totalPrice: `${(orderDetails.shipping_cost / 100).toFixed(2)} €`,
                });
            }

            console.log(`Attempting to send order confirmation email to ${orderDetails.email} for order ${supabaseOrderId} using sendOrderConfirmationEmail function.`);
            const emailSent = await sendOrderConfirmationEmail(orderDetails.email, emailProps);

            if (emailSent) {
              console.log(`Order confirmation email for ${supabaseOrderId} sent successfully.`);
            } else {
              console.error(`Failed to send order confirmation email for ${supabaseOrderId}.`);
              // Tu by ste mohli pridať logiku pre opakované odoslanie alebo notifikáciu admina
            }
          }
        }

        // TODO: Spustiť generovanie a odoslanie faktúry (Stripe Invoicing)
        console.log(`Placeholder: Trigger Stripe Invoicing for order ${supabaseOrderId}`);

      } catch (dbError: unknown) {
        console.error(`Database or other error processing order ${supabaseOrderId}:`, dbError);
        const dbErrorMessage = dbError instanceof Error ? dbError.message : 'Unknown internal server error';
        console.error(`Database or other error processing order ${supabaseOrderId}:`, dbErrorMessage);
        return NextResponse.json({ received: true, error: `Internal server error: ${dbErrorMessage}` });
      }
      break;
    
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntent.id} succeeded.`);
      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
