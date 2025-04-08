// utils/stripe.ts
import Stripe from 'stripe';

// Exportujeme funkciu, ktorá vráti inštanciu Stripe klienta až pri zavolaní
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
  }

  // Inicializácia až tu, keď je funkcia volaná (runtime)
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil', // Použijeme poslednú známu funkčnú verziu
    typescript: true,
  });
}

// Pôvodný export inštancie odstránime alebo zakomentujeme, ak by bol inde použitý
// export const stripe = new Stripe(...);
