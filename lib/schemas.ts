// lib/schemas.ts
import * as z from 'zod';

// Zod schéma pre validáciu checkout formulára
export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "Meno je povinné."),
  lastName: z.string().min(1, "Priezvisko je povinné."),
  email: z.string().email("Neplatný formát emailu."),
  phone: z.string().min(9, "Telefónne číslo musí mať aspoň 9 znakov.").regex(/^\+?[0-9\s]+$/, "Neplatný formát telefónneho čísla."),
  deliveryMethod: z.enum(['courier', 'pickup'], { required_error: "Vyberte spôsob dopravy." }),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  billingSameAsDelivery: z.boolean().default(true),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'cod'], { required_error: "Vyberte spôsob platby." }),
  agreeTerms: z.boolean().refine(val => val === true, { message: "Musíte súhlasiť s obchodnými podmienkami." }),
  agreeGdpr: z.boolean().refine(val => val === true, { message: "Musíte súhlasiť so spracovaním osobných údajov." }),
})
.refine(data => {
    // Ak je doprava kuriérom, adresa doručenia je povinná
    if (data.deliveryMethod === 'courier') {
        return !!data.street && !!data.city && !!data.zipCode && !!data.country;
    }
    return true;
}, {
    message: "Adresa doručenia (ulica, mesto, PSČ, krajina) je povinná pri doručení kuriérom.",
    path: ['street'], // Alebo iné relevantné pole adresy doručenia
})
.refine(data => {
    // Ak fakturačná adresa nie je rovnaká ako doručovacia, je povinná
    if (!data.billingSameAsDelivery) {
        return !!data.billingStreet && !!data.billingCity && !!data.billingZipCode && !!data.billingCountry;
    }
    return true;
}, {
    message: "Fakturačná adresa (ulica, mesto, PSČ, krajina) je povinná, ak sa líši od adresy doručenia.",
    path: ['billingStreet'], // Alebo iné relevantné pole fakturačnej adresy
});

// Odvodený TypeScript typ zo schémy
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
