import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react'; 
import OrderConfirmationEmail, { OrderConfirmationEmailProps } from '@/emails/OrderConfirmationEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-expect-error - Persistent type mismatch issue with apiVersion
    apiVersion: '2025-02-24.acacia', 
});

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper to format currency
function formatCurrency(amount: number | null | undefined, currency: string | null): string {
    if (amount === null || amount === undefined || currency === null) return 'N/A';
    return new Intl.NumberFormat('sk-SK', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100);
}

// Helper to format Date
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('sk-SK', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(date);
}

export async function POST(req: NextRequest) {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (webhookSecret) {
            console.log('Webhook secret found, attempting verification...');
            event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);
            console.log('Webhook signature verified.');
        } 
        else if (process.env.NODE_ENV === 'development') {
             console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set. Bypassing signature verification. FOR DEVELOPMENT ONLY! ⚠️');
             event = JSON.parse(buf) as Stripe.Event;
        } 
        else {
            throw new Error('Stripe webhook secret is not configured for non-development environment.');
        }

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`❌ Error processing webhook: ${errorMessage}`);
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`✅ Received checkout.session.completed for session: ${session.id}`);

            const customerEmail = session.customer_details?.email;
            const totalAmount = session.amount_total;
            const currency = session.currency;
            const customerName = session.customer_details?.name;
            const orderId = session.id;
            const orderDate = new Date(session.created * 1000);

            if (!customerEmail) {
                console.error('❌ Missing customer email in session:', orderId);
                return NextResponse.json({ received: true, error: 'Missing customer email' });
            }

            try {
                const lineItemsResponse = await stripe.checkout.sessions.listLineItems(orderId, {
                    limit: 50, 
                });
                console.log(`Fetched ${lineItemsResponse.data.length} line items for session ${orderId}`);

                const formattedLineItems = lineItemsResponse.data.map(item => ({
                    quantity: item.quantity ?? 0,
                    description: item.description ?? 'Neznáma položka', 
                    // Ensure currency passed to formatCurrency is string | null, not undefined
                    unitPrice: formatCurrency(item.price?.unit_amount, item.price?.currency ?? null),
                    totalPrice: formatCurrency(item.amount_total, item.currency)
                }));
                
                const emailProps: OrderConfirmationEmailProps = {
                    customerEmail: customerEmail,
                    customerName: customerName ?? undefined,
                    orderId: orderId,
                    orderDate: formatDate(orderDate),
                    totalAmount: formatCurrency(totalAmount, currency),
                    lineItems: formattedLineItems,
                };

                // Render the email component to HTML string
                // Using React explicitly here just in case, though render should suffice
                const emailHtml = await render(React.createElement(OrderConfirmationEmail, emailProps));

                console.log(`Attempting to send confirmation email to ${customerEmail}...`);
                const { data, error } = await resend.emails.send({
                    from: 'Objednávky <objednavky@tvojadomena.sk>', 
                    to: [customerEmail],
                    subject: `Potvrdenie objednávky č. ${orderId}`,
                    html: emailHtml,
                });

                if (error) {
                    console.error(`❌ Error sending email via Resend:`, error);
                    return NextResponse.json({ received: true, email_error: error.message });
                }

                console.log(`✅ Confirmation email sent successfully to ${customerEmail}. Resend ID: ${data?.id}`);

            } catch (emailError) {
                 const message = emailError instanceof Error ? emailError.message : 'Unknown email processing error';
                console.error(`❌ Failed to process or send confirmation email: ${message}`);
                return NextResponse.json({ received: true, email_prep_error: message });
            }
            break;

        default:
            console.log(`🤷‍♀️ Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
