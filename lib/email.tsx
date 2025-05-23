// lib/email.ts
import { Resend } from 'resend';
import { ReactElement } from 'react';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email sending will be disabled.');
  // V produkcii by toto mala byť tvrdá chyba alebo lepšie logovanie.
}

// Inicializujeme Resend klienta len ak je API kľúč dostupný
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailParams {
  to: string;
  subject: string;
  react: ReactElement; // Umožňuje použiť React komponenty pre emailové šablóny
  from?: string; // Odosielateľ, ak nie je špecifikovaný, použije sa default z Resend
}

export async function sendEmail({
  to,
  subject,
  react,
  from = 'Pútec E-Shop <onboarding@resend.dev>' // DOČASNÉ: Používa sa pre testovanie, kým nie je overená vlastná doména. Nahraďte vašou overenou doménou!
}: EmailParams): Promise<boolean> {
  if (!resend) {
    console.error('Resend client not initialized. Cannot send email.');
    // Simulujeme úspech v dev prostredí, ak nie je kľúč, aby neblokovalo tok
    return process.env.NODE_ENV === 'development'; 
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from, // Musí byť overená doména v Resend
      to: [to], // Resend očakáva pole emailov
      subject: subject,
      react: react,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return false;
    }

    console.log('Email sent successfully via Resend:', data);
    return true;
  } catch (e: any) {
    console.error('Exception during sending email:', e);
    return false;
  }
}

import OrderConfirmationEmail, { OrderConfirmationEmailProps } from '@/emails/OrderConfirmationEmail'; // Import šablóny
import React from 'react'; // Potrebné pre JSX

export async function sendOrderConfirmationEmail(
  recipientEmail: string,
  emailProps: OrderConfirmationEmailProps // Použijeme priamo props zo šablóny
): Promise<boolean> {
  if (!resendApiKey) { // Ak nie je API kľúč, vrátime simulovaný úspech pre dev
    console.warn('RESEND_API_KEY not set. Simulating email success for dev.');
    return process.env.NODE_ENV === 'development';
  }
  
  console.log(`Preparing to send order confirmation email to: ${recipientEmail} with subject: Potvrdenie objednávky č. ${emailProps.orderId}`);
  const emailComponent: React.ReactElement = <OrderConfirmationEmail {...emailProps} />;

  return sendEmail({
    to: recipientEmail,
    subject: `Potvrdenie objednávky č. ${emailProps.orderId}`,
    react: emailComponent,
    // from adresa sa použije defaultná z hlavnej sendEmail funkcie
  });
}
