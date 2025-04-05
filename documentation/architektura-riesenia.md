# Architektúra Riešenia: E-shop Rodinné vinárstvo Pútec

**Verzia:** 1.0
**Dátum:** 5. 4. 2025

## 1. Úvod

Tento dokument popisuje navrhovanú technickú architektúru pre e-shop Rodinného vinárstva Pútec. Riešenie je postavené na moderných technológiách s cieľom zabezpečiť škálovateľnosť, bezpečnosť a dobrý užívateľský zážitok. Hlavné komponenty zahŕňajú Next.js pre frontend, Supabase ako backend-as-a-service (BaaS) pre databázu a autentifikáciu, a Stripe pre spracovanie platieb.

## 2. Prehľad Technologického Stacku

*   **Frontend:** Next.js (React framework), TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion
*   **Backend & Databáza:** Supabase (PostgreSQL databáza, Autentifikácia, Edge Functions, Storage)
*   **Platby:** Stripe (Payments, Webhooks)
*   **Hosting:** Vercel (pre Next.js frontend), Supabase Cloud

## 3. Frontend (Next.js Aplikácia)

*   **Štruktúra:** Použitie Next.js App Routera pre moderné routovanie a serverové komponenty.
*   **UI Komponenty:** Využitie knižnice Shadcn/ui pre základné UI prvky (tlačidlá, formuláre, karty, dialógy atď.), štylizované pomocou Tailwind CSS podľa definovaného [design.md](design.md). Framer Motion pre jemné animácie a prechody.
*   **Správa Stavov:** Kombinácia React Server Components (RSC) pre získavanie dát a jednoduchších stavov, React Context API alebo Zustand pre globálnejšie klientské stavy (napr. obsah košíka).
*   **Interakcia so Supabase:**
    *   Použitie oficiálnej knižnice `@supabase/supabase-js` pre komunikáciu s databázou a autentifikáciou.
    *   Využitie `@supabase/ssr` pre server-side rendering (SSR) a serverové komponenty na bezpečné načítavanie dát a autentifikáciu na strane servera.
    *   Načítavanie produktov, zobrazovanie detailov, správa košíka.
    *   Implementácia prihlasovania a registrácie cez Supabase Auth UI komponenty alebo vlastné formuláre volajúce Supabase Auth API.
*   **Integrácia Stripe:**
    *   Použitie `@stripe/stripe-js` a `@stripe/react-stripe-js` na strane klienta.
    *   Implementácia Stripe Checkout alebo Payment Elements pre bezpečné zadávanie platobných údajov. Po úspešnom vytvorení objednávky v našej databáze (v stave 'pending') sa vygeneruje platobný zámer (Payment Intent) cez Supabase Edge Function a jeho `client_secret` sa pošle na frontend na dokončenie platby cez Stripe.

## 4. Backend (Supabase)

Supabase slúži ako centrálny backend, poskytujúci databázu, autentifikáciu, serverless funkcie a úložisko.

### 4.1 Autentifikácia (Supabase Auth)

*   Správa používateľských účtov (registrácia, prihlásenie, reset hesla).
*   Využitie email/heslo prihlásenia.
*   Rozšírenie o tabuľku `profiles` pre ukladanie dodatočných informácií (meno, rola).
*   Implementácia rolí (`customer`, `admin`) pre riadenie prístupu.

### 4.2 Databáza (Supabase Postgres)

*   **Štruktúra Tabuliek:**
    *   `profiles`: Používateľské profily a roly (prepojené na `auth.users`).
    *   `products`: Katalóg produktov (vína, degustácie, atď.) s detailmi v JSONB.
    *   `warehouses`: Definícia skladov.
    *   `inventory`: Sledovanie množstva produktov na jednotlivých skladoch.
    *   `orders`: Záznamy o objednávkach zákazníkov.
    *   `order_items`: Položky v rámci jednotlivých objednávok.
    *   `stripe_events` (Voliteľné): Logovanie prichádzajúcich Stripe webhook udalostí.
*   **Bezpečnosť (Row Level Security - RLS):**
    *   Nastavenie RLS politík na všetkých relevantných tabuľkách.
    *   Bežní používatelia (rola `customer`) môžu čítať len verejné produkty, vytvárať objednávky a čítať/aktualizovať len *svoje* profily a objednávky.
    *   Admini (rola `admin`) majú plný CRUD prístup k produktom, skladom, inventáru a všetkým objednávkam cez admin rozhranie.
    *   Neautentifikovaní používatelia môžu čítať len verejné produkty.

### 4.3 Serverless Funkcie (Supabase Edge Functions)

Napísané v TypeScript/Deno. Budú použité pre:

*   **`create-payment-intent`:** Funkcia volaná z frontendu po vytvorení objednávky v DB. Vypočíta sumu, vytvorí Payment Intent v Stripe a vráti `client_secret` na frontend.
*   **`stripe-webhook-handler`:** Verejný endpoint pre príjem webhookov zo Stripe.
    *   Overí podpis webhooku pomocou `stripe.webhooks.constructEvent`.
    *   Spracuje relevantné udalosti (napr. `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`).
    *   Aktualizuje stav objednávky (`orders.status`) v databáze.
    *   Loguje udalosť do `stripe_events` (ak sa používa).
    *   Spustí logiku pre aktualizáciu skladu (zníženie `inventory.quantity`).
    *   Spustí odoslanie notifikácií.
*   **`send-notification`:** (Môže byť súčasťou webhook handlera alebo samostatná) Funkcia na odosielanie emailových notifikácií (napr. potvrdenie objednávky, informácia o odoslaní) zákazníkovi a adminovi pomocou externej služby (napr. Resend API).
*   **`update-stock`:** (Môže byť súčasťou webhook handlera alebo samostatná) Funkcia, ktorá zníži stav zásob v tabuľke `inventory` po úspešnom zaplatení objednávky.

## 5. Platby (Stripe)

*   **Proces Platby:**
    1.  Zákazník pridá produkty do košíka na frontende.
    2.  Zákazník prejde k pokladni, zadá dodacie/fakturačné údaje.
    3.  Frontend vytvorí záznam v tabuľke `orders` so stavom 'pending' a položkami v `order_items`.
    4.  Frontend zavolá Edge Function `create-payment-intent`, ktorá vráti `client_secret`.
    5.  Frontend použije `client_secret` na zobrazenie Stripe Payment Elementu a potvrdenie platby zákazníkom.
    6.  Stripe spracuje platbu a pošle webhook udalosť na endpoint `stripe-webhook-handler`.
    7.  `stripe-webhook-handler` aktualizuje stav objednávky na 'paid', upraví skladové zásoby a odošle notifikácie.
*   **Webhooky:** Kľúčové pre asynchrónne potvrdenie platby a automatizáciu procesov po zaplatení. Endpoint musí byť verejne dostupný a zabezpečený overením podpisu.
*   **Produkty a Ceny:** Produkty a ceny budú primárne spravované v Supabase databáze. Pri vytváraní Payment Intent sa aktuálna cena a suma vypočíta na strane servera (v Edge Function) na základe objednávky v Supabase.

## 6. Admin Dashboard

*   **Účel:** Rozhranie pre administrátorov (používatelia s rolou `admin`) na správu e-shopu.
*   **Implementácia:** Bude súčasťou tej istej Next.js aplikácie, ale prístupné len pre adminov (napr. pod cestou `/admin`). Prístup bude chránený pomocou RLS a overenia role používateľa na strane servera.
*   **Funkcionalita:**
    *   **CRUD Operácie pre Produkty:** Vytváranie, čítanie, úprava, mazanie vín, degustácií a iných ponúk (`products` tabuľka).
    *   **Správa Skladov:** Definovanie skladov (`warehouses`).
    *   **Správa Inventára:** Prehľad a manuálna úprava stavu zásob (`inventory`).
    *   **Prehľad Objednávok:** Zobrazenie všetkých objednávok (`orders` a `order_items`), filtrovanie, zmena stavu (napr. 'processing', 'shipped').
    *   (Voliteľné) Správa používateľov/rolí.

## 7. Deployment

*   **Frontend (Next.js):** Nasadenie na Vercel pre optimálny výkon, jednoduché CI/CD a integráciu so serverless funkciami.
*   **Backend (Supabase):** Využitie Supabase Cloud hostingu pre databázu, autentifikáciu a Edge Functions.

## 8. Tok Dát (Príklad Nákupu)

1.  Používateľ si prehliada produkty (dáta načítané zo Supabase cez Next.js server/client komponenty).
2.  Používateľ pridá produkt do košíka (stav spravovaný na klientovi).
3.  Používateľ ide do pokladne, zadá údaje, potvrdí objednávku.
4.  Frontend (cez server action/API route) vytvorí záznamy v `orders` a `order_items` (status 'pending').
5.  Frontend zavolá Edge Function `create-payment-intent`.
6.  Edge Function overí objednávku, vypočíta sumu, vytvorí Payment Intent v Stripe, vráti `client_secret`.
7.  Frontend zobrazí Stripe Payment Element, používateľ zaplatí.
8.  Stripe pošle `payment_intent.succeeded` webhook na Supabase Edge Function `stripe-webhook-handler`.
9.  Webhook handler overí udalosť, aktualizuje `orders.status` na 'paid', zavolá funkciu na úpravu `inventory`, zavolá funkciu na odoslanie notifikácií.
10. Používateľ vidí potvrdenie objednávky na frontende. Admin vidí novú objednávku v dashboarde.
