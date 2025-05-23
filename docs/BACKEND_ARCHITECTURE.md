# Backend Architektúra a Supabase Integrácia

## 1. Úvod

Backend e-shopu Pútec je primárne postavený na platforme Supabase, ktorá poskytuje PostgreSQL databázu, autentifikáciu, úložisko súborov a ďalšie služby. Next.js slúži aj na niektoré backendové funkcie prostredníctvom API Routes a Server Actions.

## 2. Supabase ako hlavná backend platforma

Supabase je open-source alternatíva k Firebase a poskytuje nasledujúce kľúčové služby pre projekt:

*   **PostgreSQL Databáza:**
    *   Plnohodnotná relačná databáza.
    *   Schéma databázy definuje štruktúru dát pre produkty, používateľov, objednávky, sklady, atď.
    *   **Row Level Security (RLS):** Kritická súčasť zabezpečenia. RLS politiky definujú, ktorí používatelia majú prístup k akým riadkom a stĺpcom v tabuľkách. Napríklad, používateľ môže vidieť len svoje vlastné objednávky, administrátor môže vidieť všetky.
    *   **Databázové funkcie a triggery:** Možnosť definovať vlastnú logiku priamo v databáze (napr. pre automatické aktualizácie, validácie).
*   **Autentifikácia (Supabase Auth):**
    *   Kompletné riešenie pre správu používateľov: registrácia, prihlásenie, obnova hesla, prihlásenie cez sociálne siete (OAuth).
    *   Bezpečné ukladanie hesiel a správa JWT (JSON Web Tokens) pre autentifikované požiadavky.
*   **Úložisko súborov (Supabase Storage):**
    *   Pre ukladanie súborov ako obrázky produktov, faktúry, atď.
    *   Možnosť definovať prístupové práva k súborom a priečinkom.
*   **Edge Functions (voliteľné):**
    *   Serverless funkcie bežiace na hrane siete, písané v Deno (TypeScript).
    *   Vhodné pre logiku, ktorá vyžaduje nízku latenciu alebo integráciu s externými službami, ktoré nie je vhodné volať priamo z klienta alebo Next.js API routes.
*   **Realtime (voliteľné):**
    *   Umožňuje počúvať na zmeny v databáze v reálnom čase a aktualizovať UI bez nutnosti manuálneho obnovovania.

## 3. Next.js Backendové Funkcionality

Okrem Supabase, Next.js poskytuje vlastné možnosti pre backendovú logiku:

*   **API Routes (`/app/api/...`):**
    *   Umožňujú vytvárať tradičné REST alebo GraphQL API endpointy.
    *   Vhodné pre špecifické úlohy ako:
        *   Spracovanie webhookov od externých služieb (napr. Stripe pre potvrdenie platby - viď `app/api/webhooks/stripe/route.tsx`).
        *   Integrácie, ktoré vyžadujú server-side logiku a nemusia byť priamo viazané na Supabase.
        *   Komplexnejšie operácie, ktoré nie sú vhodné pre Server Actions.
*   **Server Actions:**
    *   Funkcie, ktoré bežia na serveri a môžu byť volané priamo z React Server Components alebo Client Components.
    *   Zjednodušujú mutácie dát (CRUD operácie) bez nutnosti manuálneho vytvárania API endpointov.
    *   Príklad: `app/admin/_actions/warehouseActions.ts` pre úpravu skladových zásob.
    *   Integrujú sa s Next.js kešovaním (`revalidatePath`, `revalidateTag`) pre automatickú aktualizáciu dát na klientovi.
    *   Mali by byť primárnym spôsobom pre interakciu s databázou z frontendových komponentov, pokiaľ ide o modifikáciu dát.

## 4. Integrácia so Supabase

*   **Supabase JavaScript Client (`@supabase/supabase-js`):**
    *   Hlavná knižnica pre interakciu so Supabase z Next.js (frontend aj backend časti).
    *   Používa sa na dopytovanie databázy, autentifikáciu, prácu so storage, atď.
    *   Konfigurácia klienta sa typicky nachádza v `/lib/supabaseClient.ts` alebo podobnom súbore.
*   **Správa pripojenia:**
    *   URL adresa Supabase projektu a `anon` (verejný) kľúč sú uložené v premenných prostredia (`.env.local`).
    *   Pre operácie vyžadujúce administrátorské práva (napr. v seed skriptoch alebo niektorých API routes) sa môže použiť `service_role` kľúč (musí byť prísne chránený!).
*   **Generovanie typov pre Supabase:**
    *   Supabase CLI umožňuje generovať TypeScript typy na základe schémy databázy (`supabase gen types typescript --project-id <VASE_ID> --schema public > types/supabase.ts`).
    *   Tieto typy (`types/supabase.ts`) zabezpečujú typovú bezpečnosť pri práci s dátami zo Supabase.

## 5. Dátový tok a bezpečnosť

*   **Čítanie dát:**
    *   Server Components môžu priamo pristupovať k Supabase pomocou server-side Supabase klienta.
    *   Client Components používajú knižnice ako React Query/SWR alebo Server Actions (ktoré môžu volať Supabase) na načítanie dát.
    *   RLS politiky v Supabase zabezpečujú, že sa vrátia len autorizované dáta.
*   **Zápis/Modifikácia dát:**
    *   Primárne cez Server Actions.
    *   Server Actions bežia na serveri, kde môžu bezpečne interagovať so Supabase (napr. s použitím `service_role` kľúča, ak je to nevyhnutné a bezpečne spravované, aj keď preferované je spoliehať sa na RLS a autentifikovaného používateľa).
    *   Validácia vstupných dát pred zápisom do databázy je kľúčová (napr. pomocou Zod).
*   **Autentifikácia používateľa:**
    *   Supabase Auth rieši registráciu, prihlásenie a správu session.
    *   Next.js Middleware môže kontrolovať prítomnosť a platnosť session tokenu (JWT) a chrániť routy.
    *   Informácie o prihlásenom používateľovi sú dostupné v Server Components a cez Context API v Client Components.

## 6. Príklad: Spracovanie objednávky

1.  Používateľ odošle objednávku z `/pokladna` (Client Component).
2.  Volá sa Server Action `processOrder`.
3.  Server Action `processOrder`:
    a.  Validuje dáta objednávky.
    b.  Vytvorí záznam o objednávke v Supabase databáze.
    c.  Interaguje so Stripe API na vytvorenie platby (môže byť aj presmerovanie na Stripe stránku).
    d.  Aktualizuje stav objednávky v Supabase na základe odpovede od Stripe (alebo čaká na webhook).
    e.  Posiela potvrdzovací email (napr. cez Resend, viď `lib/send-order-emails.ts`).
    f.  Invaliduje relevantné kešované dáta (`revalidatePath`).
4.  Stripe po úspešnej platbe môže poslať webhook na Next.js API Route (`/app/api/webhooks/stripe/route.tsx`).
5.  API Route spracuje webhook, overí jeho pravosť a finálne potvrdí objednávku v Supabase databáze.

## 7. Škálovateľnosť a údržba

*   **Supabase:** Je navrhnutý pre škálovanie. Ponúka rôzne plány a možnosti optimalizácie databázy.
*   **Next.js:** Serverless povaha API Routes a Server Actions umožňuje dobrú škálovateľnosť.
*   **Modularita:** Rozdelenie logiky do Server Actions, API Routes a Supabase funkcií pomáha udržiavať kód organizovaný.

## 8. Záver

Kombinácia Supabase a Next.js poskytuje silný a flexibilný stack pre backend e-shopu Pútec. Dôraz na RLS, bezpečné Server Actions a správne využitie služieb Supabase je kľúčom k robustnej a bezpečnej aplikácii.
