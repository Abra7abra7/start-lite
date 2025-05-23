# Integrácia Platobnej Brány Stripe

## 1. Úvod

E-shop Pútec využíva Stripe ako platobnú bránu na spracovanie online platieb. Tento dokument popisuje kľúčové aspekty integrácie Stripe, vrátane nastavenia, procesu platby a spracovania webhookov.

## 2. Prečo Stripe?

*   **Spoľahlivosť a bezpečnosť:** Stripe je globálne uznávaná platforma s vysokými bezpečnostnými štandardmi (PCI DSS Level 1).
*   **Jednoduchá integrácia:** Ponúka rozsiahlu dokumentáciu a klientske knižnice pre rôzne jazyky a frameworky (vrátane Node.js/JavaScript).
*   **Široká škála platobných metód:** Podporuje platby kartou, digitálne peňaženky (Apple Pay, Google Pay), a lokálne platobné metódy.
*   **Nástroje pre developerov:** Prehľadný dashboard, testovacie prostredie, webhooky pre automatizáciu procesov.

## 3. Nastavenie Stripe

*   **Vytvorenie Stripe účtu:** Registrácia na [stripe.com](https://stripe.com).
*   **Získanie API kľúčov:**
    *   **Publishable Key (Verejný kľúč):** Používa sa na strane klienta (frontend) na tokenizáciu platobných údajov. Bezpečný na zverejnenie.
    *   **Secret Key (Tajný kľúč):** Používa sa na strane servera na volanie Stripe API (vytváranie platieb, refundácie, atď.). Musí byť prísne chránený a nikdy by nemal byť vystavený na strane klienta.
    *   Oba kľúče (pre testovacie aj produkčné prostredie) sa ukladajú do premenných prostredia v Next.js projekte (napr. `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`).
*   **Konfigurácia produktov a cien (voliteľné v Stripe):**
    *   Ak sa produkty a ceny spravujú primárne v Stripe, je potrebné ich tam vytvoriť. Pre e-shop Pútec sa ceny pravdepodobne spravujú v lokálnej databáze a do Stripe sa posielajú pri vytváraní platby.
*   **Nastavenie webhookov:**
    *   V Stripe dashboarde sa konfiguruje endpoint URL, na ktorý bude Stripe posielať notifikácie o udalostiach (napr. úspešná platba, neúspešná platba, refundácia).
    *   Pre e-shop Pútec to bude API Route v Next.js, napríklad `/app/api/webhooks/stripe/route.tsx`.
    *   **Webhook Signing Secret:** Kľúč používaný na overenie pravosti webhookov prichádzajúcich od Stripe. Ukladá sa do premenných prostredia (napr. `STRIPE_WEBHOOK_SECRET`).

## 4. Proces platby

Typický proces platby pomocou Stripe Elements (odporúčaný spôsob pre vlastné formuláre) alebo Stripe Checkout (presmerovanie na hostovanú stránku Stripe).

**Scenár s Stripe Elements (väčšia kontrola nad UI):**

1.  **Zobrazenie platobného formulára (Frontend - `/pokladna`):**
    *   Načítanie Stripe.js pomocou `@stripe/stripe-js`.
    *   Inicializácia Stripe s verejným kľúčom.
    *   Vytvorenie inštancie `Elements` providera a vloženie platobných elementov (napr. `CardElement`) do formulára.
2.  **Vytvorenie PaymentIntent (Backend - Server Action alebo API Route):**
    *   Keď používateľ prejde k platbe, frontend zavolá backendovú funkciu (napr. Server Action `createPaymentIntent`).
    *   Táto funkcia na serveri:
        *   Vypočíta celkovú sumu objednávky.
        *   Zavolá Stripe API (`stripe.paymentIntents.create()`) pomocou tajného kľúča na vytvorenie `PaymentIntent`.
        *   `PaymentIntent` reprezentuje zámer uskutočniť platbu a sleduje jej životný cyklus.
        *   Funkcia vráti `client_secret` z `PaymentIntent` na frontend.
3.  **Potvrdenie platby (Frontend):**
    *   Frontend použije `client_secret` a funkciu `stripe.confirmCardPayment()` (alebo inú podľa platobnej metódy) na odoslanie platobných údajov (z `CardElement`) priamo do Stripe.
    *   Platobné údaje karty nikdy neprechádzajú cez váš server, čo znižuje PCI compliance záťaž.
4.  **Spracovanie výsledku platby (Frontend):**
    *   Stripe API vráti výsledok potvrdenia platby.
    *   Ak je platba úspešná, používateľ je presmerovaný na stránku potvrdenia objednávky (`/objednavka-potvrdena`). Stav objednávky v lokálnej databáze sa môže predbežne aktualizovať.
    *   Ak platba zlyhá, zobrazí sa chybová správa.
5.  **Spracovanie webhooku (Backend - API Route `/app/api/webhooks/stripe/route.tsx`):**
    *   Stripe pošle udalosť (napr. `payment_intent.succeeded`, `payment_intent.payment_failed`) na nakonfigurovaný webhook endpoint.
    *   Backendová API Route:
        *   **Overí podpis webhooku** pomocou `STRIPE_WEBHOOK_SECRET` na zabezpečenie, že požiadavka skutočne prišla od Stripe.
        *   Spracuje udalosť:
            *   Pri `payment_intent.succeeded`: Definitívne potvrdí objednávku v databáze (zmení stav na 'paid'), zníži skladové zásoby, pošle potvrdzovací email zákazníkovi a prípadne notifikáciu administrátorovi.
            *   Pri iných udalostiach (napr. zlyhanie) môže aktualizovať stav objednávky alebo vykonať iné potrebné akcie.
        *   Odpovie Stripe s HTTP statusom 200 OK na potvrdenie prijatia webhooku.

**Scenár so Stripe Checkout (jednoduchšia integrácia, menej kontroly nad UI):**

1.  **Vytvorenie Checkout Session (Backend - Server Action alebo API Route):**
    *   Keď používateľ klikne na "Zaplatiť", frontend zavolá backendovú funkciu.
    *   Táto funkcia na serveri vytvorí Stripe Checkout Session (`stripe.checkout.sessions.create()`) s detailmi objednávky (položky, sumy, `success_url`, `cancel_url`).
    *   Funkcia vráti ID Checkout Session na frontend.
2.  **Presmerovanie na Stripe (Frontend):**
    *   Frontend použije `stripe.redirectToCheckout({ sessionId: 'SESSION_ID' })` na presmerovanie používateľa na hostovanú platobnú stránku Stripe.
3.  **Spracovanie platby na Stripe:**
    *   Používateľ zadá platobné údaje priamo na stránke Stripe.
4.  **Presmerovanie späť do e-shopu:**
    *   Po dokončení platby (úspešnej alebo neúspešnej) Stripe presmeruje používateľa na `success_url` alebo `cancel_url` definované pri vytváraní session.
5.  **Spracovanie webhooku (Backend):**
    *   Rovnako ako pri Stripe Elements, Stripe pošle udalosť `checkout.session.completed` (a iné relevantné udalosti) na webhook endpoint.
    *   Backend spracuje webhook, overí platbu a aktualizuje stav objednávky v databáze.

## 5. Kľúčové súbory a knižnice

*   **Knižnice:**
    *   `@stripe/stripe-js`: Pre frontendovú časť (načítanie Stripe.js, interakcia s Elements).
    *   `stripe`: Oficiálna Node.js knižnica pre Stripe API (používaná na backendu).
*   **Premenné prostredia:**
    *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (premenná s prefixom `NEXT_PUBLIC_` je dostupná aj na frontende)
    *   `STRIPE_SECRET_KEY`
    *   `STRIPE_WEBHOOK_SECRET`
*   **Backend kód:**
    *   Funkcie pre vytváranie PaymentIntents alebo Checkout Sessions (môžu byť v Server Actions alebo API Routes).
    *   API Route pre spracovanie webhookov: `/app/api/webhooks/stripe/route.tsx`.
*   **Frontend kód:**
    *   Komponenty pre platobný formulár (napr. v `/app/pokladna/_components/CheckoutForm.tsx`).
    *   Logika pre volanie backendu a spracovanie odpovedí od Stripe.

## 6. Bezpečnosť a PCI Compliance

*   Použitím Stripe Elements alebo Stripe Checkout sa citlivé údaje o karte (číslo karty, CVC) posielajú priamo do Stripe a nikdy neprechádzajú cez servery e-shopu Pútec. Tým sa výrazne znižuje záťaž spojená s PCI DSS compliance.
*   **Overovanie webhookov:** Je kriticky dôležité overovať podpisy webhookov, aby sa zabránilo spracovaniu falošných požiadaviek.
*   **Ochrana tajných kľúčov:** `STRIPE_SECRET_KEY` a `STRIPE_WEBHOOK_SECRET` musia byť bezpečne uložené a nikdy nesmú byť vystavené na frontende alebo v kóde repozitára.

## 7. Testovanie

*   Stripe poskytuje rozsiahle možnosti testovania:
    *   Testovacie API kľúče.
    *   Testovacie čísla kariet pre rôzne scenáre (úspešná platba, zamietnutá karta, atď.).
    *   Možnosť simulovať posielanie webhookov z Stripe dashboardu alebo pomocou Stripe CLI.

## 8. Záver

Integrácia Stripe poskytuje e-shopu Pútec bezpečný a spoľahlivý spôsob prijímania online platieb. Dôsledná implementácia procesu platby, najmä spracovania webhookov a zabezpečenia API kľúčov, je nevyhnutná pre správne fungovanie a bezpečnosť systému.
