// app/pokladna/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { createOrder } from '@/app/actions/orderActions';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/schemas';

export default function PokladnaPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice(); // Cena len za produkty
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null); // Stav pre cenu dopravy
  const router = useRouter();

  // 1. Definovanie formulára s použitím importovanej schémy a typu
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
      country: "Slovensko",
      billingSameAsDelivery: true,
      billingStreet: "",
      billingCity: "",
      billingZipCode: "",
      billingCountry: "Slovensko",
      agreeTerms: false,
      agreeGdpr: false,
      // deliveryMethod a paymentMethod nemajú default, aby vyžadovali výber
    },
  });
 
  const deliveryMethodValue = form.watch('deliveryMethod'); // Sledovanie hodnoty pre useEffect

  // Efekt na výpočet ceny dopravy pri zmene spôsobu doručenia
  useEffect(() => {
    if (deliveryMethodValue === 'courier') {
      setShippingCost(5); // Fixná cena za kuriéra
    } else if (deliveryMethodValue === 'pickup') {
      setShippingCost(0); // Osobný odber zdarma
    } else {
      setShippingCost(null); // Nezvolený spôsob
    }
  }, [deliveryMethodValue]);

  // 2. Define a submit handler.
  const onSubmit: SubmitHandler<CheckoutFormData> = async (values) => {
    setIsSubmitting(true);
    console.log("Formulár odoslaný:", values);
    
    // Overenie, či bola zvolená doprava a vypočítaná cena
    if (shippingCost === null) {
        toast.error("Prosím, vyberte spôsob doručenia.");
        setIsSubmitting(false);
        return;
    }

    try {
      // Pridaný shippingCost ako 4. argument
      const result = await createOrder(values, cartItems, totalPrice, shippingCost);

      if (result.success) {
        // Znova použijeme 'in' operátor na bezpečné zúženie typu
        if ('sessionId' in result) {
          // Platba kartou - presmerovanie na Stripe
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
          if (!stripe) {
            throw new Error('Nepodarilo sa načítať Stripe.');
          }
          const { error } = await stripe.redirectToCheckout({ sessionId: result.sessionId });
          if (error) {
            console.error("Stripe redirect error:", error);
            throw new Error(error.message || 'Nepodarilo sa presmerovať na platobnú bránu.');
          }
          // Košík sa vyčistí až po úspešnej platbe cez webhook
        } else if ('orderId' in result) {
          // Dobierka - úspešne vytvorená
          toast.success("Objednávka bola úspešne vytvorená!");
          clearCart(); // Vyčistiť košík hneď
          // Presmerovanie na stránku s poďakovaním
          router.push(`/objednavka/dakujeme?orderId=${result.orderId}`); 
        }
      } else {
        // Chyba v Server Action
        throw new Error(result.error || 'Nastala chyba pri spracovaní objednávky.');
      }
    } catch (error) {
      console.error("Order submission error:", error);
      const message = error instanceof Error ? error.message : "Nastala neočakávaná chyba.";
      toast.error(`Chyba: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const deliveryMethod = form.watch('deliveryMethod');
  const billingSameAsDelivery = form.watch('billingSameAsDelivery');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pokladňa</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stĺpec s formulárom */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Kontaktné údaje */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Kontaktné údaje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meno</FormLabel>
                        <FormControl>
                          <Input placeholder="Ján" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priezvisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Vážny" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jan.vazny@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefón</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+421 9xx xxx xxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              {/* Doručenie a Adresa */}
              <section>
                 <h2 className="text-xl font-semibold mb-4">Spôsob doručenia</h2>
                 <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:bg-muted">
                            <FormControl>
                              <RadioGroupItem value="courier" />
                            </FormControl>
                            <FormLabel className="font-normal flex-grow cursor-pointer">
                              Doručenie kuriérom
                              {/* TODO: Zobraziť cenu dopravy */} 
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:bg-muted">
                            <FormControl>
                              <RadioGroupItem value="pickup" />
                            </FormControl>
                            <FormLabel className="font-normal flex-grow cursor-pointer">
                              Osobný odber (Vinárstvo Pútec, adresa...)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Adresné polia - zobrazené len ak je vybraný kuriér */}
                {deliveryMethod === 'courier' && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Doručovacia adresa</h3>
                     <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ulica a číslo</FormLabel>
                          <FormControl>
                            <Input placeholder="Hlavná 123/45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mesto</FormLabel>
                            <FormControl>
                              <Input placeholder="Mesto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PSČ</FormLabel>
                            <FormControl>
                              <Input placeholder="123 45" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Krajina</FormLabel>
                            <FormControl>
                              {/* TODO: Pridať Select komponent pre krajiny? */}
                              <Input {...field} /> 
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                )}
              </section>

              <Separator />

              {/* Fakturačné údaje */}
              <section>
                  <h2 className="text-xl font-semibold mb-4">Fakturačné údaje</h2>
                   <FormField
                      control={form.control}
                      name="billingSameAsDelivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Resetuj fakturačné polia, ak sa zmení na true
                                if (checked) {
                                    form.resetField("billingStreet");
                                    form.resetField("billingCity");
                                    form.resetField("billingZipCode");
                                    form.resetField("billingCountry");
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Fakturačná adresa je rovnaká ako doručovacia
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                  {/* Fakturačné polia - zobrazené len ak NIE JE zaškrtnuté "rovnaká adresa" */}
                  {!billingSameAsDelivery && (
                     <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium">Fakturačná adresa</h3>
                       <FormField
                        control={form.control}
                        name="billingStreet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ulica a číslo</FormLabel>
                            <FormControl>
                              <Input placeholder="Fakturačná ulica 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="billingCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mesto</FormLabel>
                              <FormControl>
                                <Input placeholder="Fakturačné mesto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingZipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PSČ</FormLabel>
                              <FormControl>
                                <Input placeholder="987 65" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                       <FormField
                          control={form.control}
                          name="billingCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Krajina</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  )}
              </section>

              <Separator />

              {/* Spôsob platby */} 
              <section>
                <h2 className="text-xl font-semibold mb-4">Spôsob platby</h2>
                 <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:bg-muted">
                            <FormControl>
                              {/* Dobierka dostupná len pre kuriéra */}
                              <RadioGroupItem value="cod" disabled={deliveryMethod !== 'courier'} />
                            </FormControl>
                            <FormLabel className={`font-normal flex-grow cursor-pointer ${deliveryMethod !== 'courier' ? 'text-muted-foreground cursor-not-allowed' : ''}`}>
                              Dobierka
                              <FormDescription className={`${deliveryMethod !== 'courier' ? '' : 'hidden'}`}>
                                 Dostupné len pre doručenie kuriérom.
                              </FormDescription>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:bg-muted">
                            <FormControl>
                              <RadioGroupItem value="stripe" />
                            </FormControl>
                            <FormLabel className="font-normal flex-grow cursor-pointer">
                              Platba kartou online (Stripe)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator />

               {/* Súhlasy */}
              <section className="space-y-4">
                 <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Súhlasím s <Link href="/obchodne-podmienky" target="_blank" className="underline hover:text-primary">obchodnými podmienkami</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="agreeGdpr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Súhlasím so <Link href="/ochrana-osobnych-udajov" target="_blank" className="underline hover:text-primary">spracovaním osobných údajov</Link>
                        </FormLabel>
                         <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </section>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Spracováva sa...</>
                ) : (
                  'Odoslať Objednávku a zaplatiť' // Text sa môže dynamicky meniť podľa platby
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Stĺpec so zhrnutím košíka */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 border rounded-lg p-6 bg-muted/40">
            <h2 className="text-xl font-semibold mb-4">Zhrnutie Objednávky</h2>
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">Váš košík je prázdny.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-grow">
                       <div className="relative h-12 w-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-xs">Obr.</div>
                          )}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} €</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm flex-shrink-0">{(item.quantity * item.price).toFixed(2)} €</p>
                  </div>
                ))}
                <Separator />
                {/* Zobrazenie ceny produktov (medzisúčet) */}
                <div className="flex justify-between text-muted-foreground">
                  <span>Medzisúčet</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                {/* Zobrazenie ceny dopravy, ak je zvolená */}
                {shippingCost !== null && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Doprava</span>
                        <span>{shippingCost.toFixed(2)} €</span>
                    </div>
                )}
                <Separator />
                {/* Celková suma */} 
                <div className="flex justify-between font-bold text-lg">
                  <span>Celkom</span>
                  {/* Zobraziť celkovú sumu len ak je doprava vypočítaná */}
                  <span>{(totalPrice + (shippingCost ?? 0)).toFixed(2)} €</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
