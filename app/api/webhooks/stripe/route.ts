// c:\Users\mstancik\Desktop\github\start-lite\app\api\webhooks\stripe\route.ts

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe'; // Your initialized Stripe client
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import standard Supabase client

// Define expected environment variables for clarity
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for admin access

// Basic check for environment variables on startup
if (!STRIPE_WEBHOOK_SECRET) {
    console.error('*** Stripe webhook secret is missing. Set STRIPE_WEBHOOK_SECRET environment variable.');
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('*** Supabase URL or Service Role Key is missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}


export async function POST(req: Request) {
    // Check if environment variables are set, fail early if not
    if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
         console.error('Webhook processing failed: Missing environment variables.');
        return new NextResponse('Webhook configuration error.', { status: 500 });
    }

    const signature = req.headers.get('stripe-signature');
    // Important: Need raw body for verification
    const reqBuffer = await req.arrayBuffer(); // Read request body as buffer

    if (!signature) {
        console.error('Webhook error: Missing stripe-signature header');
        return new NextResponse('Missing stripe-signature header', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // Verify the event came from Stripe
        event = stripe.webhooks.constructEvent(
            Buffer.from(reqBuffer), // Use buffer directly
            signature,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Initialize Supabase Admin Client **inside** the handler
    // It's generally safer to initialize clients closer to where they are used
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Webhook received: checkout.session.completed');
            console.log('Session ID:', session.id);
            console.log('Metadata:', session.metadata);

            // Metadata should contain the order ID we passed during session creation
            const supabaseOrderId = session.metadata?.supabaseOrderId;

            if (!supabaseOrderId) {
                console.error('Webhook error: supabaseOrderId missing from session metadata.');
                // Return 200 to Stripe to prevent retries for this specific issue,
                // but log the error for investigation.
                return new NextResponse('Missing order ID in metadata.', { status: 200 });
            }

            // Convert ID back to number if your DB expects bigint/number
            const orderId = parseInt(supabaseOrderId, 10);
            if (isNaN(orderId)) {
                 console.error(`Webhook error: Invalid supabaseOrderId format in metadata: ${supabaseOrderId}`);
                 // Return 200 to prevent retries
                 return new NextResponse('Invalid order ID format.', { status: 200 });
            }

            console.log(`Processing order ID: ${orderId}`);

            try {
                // Update the order status in your database
                const { error: updateError } = await supabaseAdmin
                    .from('orders')
                    .update({
                        status: 'paid', // Or 'processing', 'completed', etc.
                        stripe_session_id: session.id // Optionally save the session ID
                    })
                    .eq('id', orderId); // Match using the numeric ID

                if (updateError) {
                    console.error(`Supabase update error for order ${orderId}:`, updateError);
                    // Return 500 to signal Stripe to retry (or handle based on error type)
                    return new NextResponse(`Failed to update order: ${updateError.message}`, { status: 500 });
                }

                console.log(`Order ${orderId} status updated to 'paid' successfully.`);
                // TODO: Add any post-payment logic here (e.g., send confirmation email, trigger fulfillment)

            } catch (dbError: any) {
                 console.error(`Unexpected database error for order ${orderId}:`, dbError);
                 return new NextResponse(`Database error: ${dbError.message}`, { status: 500 });
            }
            break;

        // case 'payment_intent.succeeded':
        //   const paymentIntent = event.data.object;
        //   // Handle successful payment intent
        //   break;
        // case 'payment_intent.payment_failed':
        //   const paymentIntentFailed = event.data.object;
        //   // Handle failed payment intent
        //   break;

        // ... handle other event types as needed

        default:
            console.log(`Unhandled webhook event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}

// Optional: Handle GET requests or other methods if needed, otherwise they default to 405 Method Not Allowed
// export async function GET(req: Request) {
//     return new NextResponse('Method Not Allowed', { status: 405 });
// }
