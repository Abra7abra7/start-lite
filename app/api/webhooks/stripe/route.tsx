// c:\Users\mstancik\Desktop\github\start-lite\app\api\webhooks\stripe\route.ts

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe'; // Your initialized Stripe client
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import standard Supabase client
import { Resend } from 'resend';
import { render } from '@react-email/render';
import OrderConfirmationEmail, { OrderConfirmationEmailProps } from '@/emails/OrderConfirmationEmail';

// Define expected environment variables for clarity
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for admin access
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev'; // Default or from env

// Initialize Resend client
let resend: Resend | null = null;
if (RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
} else {
    console.warn('*** Resend API Key is missing. Email sending will be disabled. Set RESEND_API_KEY environment variable.');
}

// Basic check for environment variables on startup
if (!STRIPE_WEBHOOK_SECRET) {
    console.error('*** Stripe webhook secret is missing. Set STRIPE_WEBHOOK_SECRET environment variable.');
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('*** Supabase URL or Service Role Key is missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

// Helper to format currency
function formatCurrency(amount: number | null | undefined, currency: string | null): string {
    if (amount === null || amount === undefined || currency === null) return 'N/A';
    // Stripe amounts are in cents, convert to base unit
    return new Intl.NumberFormat('sk-SK', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100);
}

// Helper to format Date from Unix timestamp
function formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('sk-SK', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(timestamp * 1000)); // Convert Unix timestamp to milliseconds
}

export async function POST(req: Request) {
    // Check if environment variables are set, fail early if not
    if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
         console.error('Webhook processing failed: Missing environment variables.');
        return new NextResponse('Webhook configuration error.', { status: 500 });
    }

    const signature = req.headers.get('stripe-signature');
    const reqBuffer = await req.arrayBuffer();

    if (!signature) {
        console.error('Webhook error: Missing stripe-signature header');
        return new NextResponse('Missing stripe-signature header', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            Buffer.from(reqBuffer),
            signature,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Webhook received: checkout.session.completed');
            console.log('Session ID:', session.id);
            console.log('Metadata:', session.metadata);

            const supabaseOrderId = session.metadata?.supabaseOrderId;

            if (!supabaseOrderId) {
                console.error('Webhook error: supabaseOrderId missing from session metadata.');
                return new NextResponse('Missing order ID in metadata.', { status: 200 });
            }

            const orderId = parseInt(supabaseOrderId, 10);
            if (isNaN(orderId)) {
                 console.error(`Webhook error: Invalid supabaseOrderId format in metadata: ${supabaseOrderId}`);
                 return new NextResponse('Invalid order ID format.', { status: 200 });
            }

            console.log(`Processing order ID: ${orderId}`);

            try {
                // 1. Update the order status in your database
                const { error: updateError } = await supabaseAdmin
                    .from('orders')
                    .update({
                        status: 'paid', // Or 'processing'
                        stripe_session_id: session.id
                    })
                    .eq('id', orderId)
                    .select(); // Select to confirm update happened if needed

                if (updateError) {
                    console.error(`Supabase update error for order ${orderId}:`, updateError);
                    return new NextResponse(`Failed to update order: ${updateError.message}`, { status: 500 });
                }

                console.log(`Order ${orderId} status updated to 'paid' successfully.`);

                // --- 2. Send Confirmation Email --- 
                if (!resend) {
                    console.warn('Resend not configured, skipping email confirmation.');
                } else {
                    const customerEmail = session.customer_details?.email;
                    if (!customerEmail) {
                         console.error(`Cannot send email for order ${orderId}: Customer email missing in Stripe session.`);
                         // Don't fail the webhook for this, just log it.
                    } else {
                        console.log(`Preparing confirmation email for order ${orderId} to ${customerEmail}...`);
                        try {
                             // Fetch line items for the email
                            const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
                                limit: 50, // Adjust limit as needed
                            });

                            // Map line items WITHOUT image URL (reverted to original)
                            const emailLineItems = lineItemsResponse.data.map(item => {
                                return {
                                    quantity: item.quantity ?? 0,
                                    description: item.description ?? 'Neznáma položka',
                                    unitPrice: formatCurrency(item.price?.unit_amount, item.price?.currency ?? null),
                                    totalPrice: formatCurrency(item.amount_total, item.currency),
                                };
                            });

                             // Prepare props for the email template
                             const emailProps: OrderConfirmationEmailProps = {
                                customerEmail: customerEmail,
                                customerName: session.customer_details?.name ?? undefined,
                                orderId: supabaseOrderId, // Use our internal order ID
                                orderDate: formatDate(session.created),
                                totalAmount: formatCurrency(session.amount_total, session.currency),
                                lineItems: emailLineItems, // Use the mapped array WITHOUT image URLs
                                // Shop details are now defaults in the email component
                            };

                            // Render the email component to HTML string
                            const emailHtml = await render(<OrderConfirmationEmail {...emailProps} />);

                            console.log(`Sending confirmation email for order ${orderId}...`);
                            const { data: emailData, error: emailError } = await resend.emails.send({
                                from: `Váš Obchod <${EMAIL_FROM_ADDRESS}>`, // Customize sender name and use configured email
                                to: [customerEmail],
                                subject: `Potvrdenie objednávky č. ${supabaseOrderId}`,
                                html: emailHtml, // Pass the variable directly
                            });

                             if (emailError) {
                                console.error(`Error sending email via Resend for order ${orderId}:`, emailError);
                                // Log the error but don't necessarily fail the webhook (database is updated)
                            } else {
                                console.log(`✅ Confirmation email sent successfully for order ${orderId}. Resend ID: ${emailData?.id}`);
                            }

                        } catch (emailPrepError: any) {
                            console.error(`Error preparing or sending email for order ${orderId}:`, emailPrepError);
                            // Log the error but don't fail the webhook
                        }
                    }
                }
                // --- End Send Confirmation Email ---

            } catch (dbError: any) {
                 console.error(`Unexpected database error for order ${orderId}:`, dbError);
                 return new NextResponse(`Database error: ${dbError.message}`, { status: 500 });
            }
            break;

        // ... handle other event types

        default:
            console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
