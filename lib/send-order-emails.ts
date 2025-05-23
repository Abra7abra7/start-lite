import { Resend } from 'resend';
import { render } from '@react-email/render';
import OrderConfirmationCustomer from '@/emails/OrderConfirmationCustomer';
import OrderNotificationOwner from '@/emails/OrderNotificationOwner';
import React from 'react';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;
const ownerEmail = process.env.OWNER_EMAIL || 'stancikmarian8@gmail.com'; // Fallback, should be in .env!

// --- Enhanced Logging for Environment Variables --- 
console.log('[sendOrderEmails] Initializing...');
console.log(`[sendOrderEmails] RESEND_API_KEY set: ${!!resendApiKey}`);
console.log(`[sendOrderEmails] FROM_EMAIL set: ${fromEmail ? fromEmail : 'Not Set'}`);
console.log(`[sendOrderEmails] OWNER_EMAIL set: ${ownerEmail}`);
// --- End Enhanced Logging --- 

if (!resendApiKey) {
    console.warn('[sendOrderEmails] RESEND_API_KEY environment variable is not set. Emails will not be sent.');
}
if (!fromEmail) {
    console.warn('[sendOrderEmails] FROM_EMAIL environment variable is not set. Emails will not be sent. Ensure it is a verified domain in Resend.');
}
if (!process.env.OWNER_EMAIL) {
    console.warn('[sendOrderEmails] OWNER_EMAIL environment variable is not set. Using fallback for owner notifications.');
}

// Define the structure for order details needed by the email templates
interface OrderDetails {
    orderId: number;
    orderDate: string; // Formatted date string
    customerName: string | null;
    customerEmail: string | null;
    totalPrice: string; // Formatted currency string
    items: { name: string; quantity: number; price: string }[]; // Formatted price string
    shippingAddress?: string;
    billingAddress?: string;
}

// Initialize Resend client only if API key exists
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOrderEmails(orderDetails: OrderDetails): Promise<void> {
    // Check if Resend is initialized and required emails are present
    if (!resend || !fromEmail || !orderDetails.customerEmail) {
        console.error('[sendOrderEmails] Pre-send check failed: Resend not initialized, FROM_EMAIL missing, or customer email missing. Cannot send order emails.');
        // Log details for debugging
        console.error(`[sendOrderEmails] Details - Resend initialized: ${!!resend}, From email set: ${!!fromEmail}, Customer email present: ${!!orderDetails.customerEmail}`);
        return;
    }

    console.log(`[sendOrderEmails] Preparing emails for Order ID: ${orderDetails.orderId}`);

    try {
        // Render email templates to HTML strings
        const customerEmailHtml: string = await render(
            React.createElement(OrderConfirmationCustomer, orderDetails)
        );
        const ownerEmailHtml: string = await render(
            React.createElement(OrderNotificationOwner, orderDetails)
        );

        console.log(`[sendOrderEmails] Rendered HTML for customer: ${customerEmailHtml.substring(0, 100)}...`); // Log first 100 chars
        console.log(`[sendOrderEmails] Rendered HTML for owner: ${ownerEmailHtml.substring(0, 100)}...`); // Log first 100 chars

        // Send email to customer
        console.log(`[sendOrderEmails] Attempting to send confirmation email to ${orderDetails.customerEmail} from ${fromEmail}`);
        const { data: customerData, error: customerError } = await resend.emails.send({
            from: fromEmail, // Use the configured FROM_EMAIL
            to: [orderDetails.customerEmail], // Customer's email
            subject: `Potvrdenie objednávky č. ${orderDetails.orderId}`,
            html: customerEmailHtml, // Pass the rendered HTML string
        });

        if (customerError) {
            console.error(`[sendOrderEmails] Error sending email to customer ${orderDetails.customerEmail}:`, customerError);
            // Do not throw here, try sending to owner anyway
        } else {
            console.log(`[sendOrderEmails] Successfully sent email to customer ${orderDetails.customerEmail}. Resend ID: ${customerData?.id}`);
        }

        // Send email to owner
        console.log(`[sendOrderEmails] Attempting to send notification email to owner ${ownerEmail} from ${fromEmail}`);
        const { data: ownerData, error: ownerError } = await resend.emails.send({
            from: fromEmail, // Use the configured FROM_EMAIL
            to: [ownerEmail], // Owner's email
            subject: `Nová objednávka č. ${orderDetails.orderId}`,
            html: ownerEmailHtml, // Pass the rendered HTML string
        });

        if (ownerError) {
            console.error(`[sendOrderEmails] Error sending email to owner ${ownerEmail}:`, ownerError);
        } else {
             console.log(`[sendOrderEmails] Successfully sent email to owner ${ownerEmail}. Resend ID: ${ownerData?.id}`);
        }

    } catch (error) {
        console.error(`[sendOrderEmails] Unexpected error during email sending process for Order ID ${orderDetails.orderId}:`, error);
    }
}
