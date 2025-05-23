# Proces Autentifikácie a Autorizácie

## 1. Úvod

Autentifikácia (overenie identity používateľa) a autorizácia (udelenie prístupových práv) sú kľúčovými bezpečnostnými aspektmi e-shopu Pútec. Tento dokument popisuje, ako sú tieto procesy riešené pomocou Supabase Auth a Next.js.

## 2. Autentifikácia pomocou Supabase Auth

Supabase Auth poskytuje komplexné riešenie pre správu identity používateľov.

*   **Poskytovatelia prihlásenia:**
    *   **Email/Heslo:** Štandardné prihlásenie pomocou emailovej adresy a hesla.
        *   Registrácia nového používateľa.
        *   Prihlásenie existujúceho používateľa.
        *   Obnova zabudnutého hesla (cez emailový odkaz).
        *   Potvrdenie emailovej adresy (voliteľné, ale odporúčané).
    *   **OAuth Poskytovatelia (Sociálne prihlásenie):**
        *   Napríklad Google, Facebook, GitHub, atď.
        *   Zjednodušuje registráciu a prihlásenie pre používateľov.
        *   Konfigurácia prebieha v Supabase dashboarde.
*   **JSON Web Tokens (JWT):**
    *   Po úspešnej autentifikácii Supabase Auth vydá JWT.
    *   Tento token sa posiela s každou požiadavkou na Supabase (a prípadne na chránené Next.js API routes) na overenie identity používateľa.
    *   JWT obsahuje informácie o používateľovi (napr. `user_id`, `email`) a expiračný čas.
    *   Môže obsahovať aj vlastné claims (napr. rolu používateľa).
*   **Správa session:**
    *   Supabase klient (`@supabase/supabase-js`) automaticky spravuje session používateľa, vrátane ukladania a obnovovania JWT (typicky v `localStorage`).
    *   Poskytuje metódy na odhlásenie používateľa (`supabase.auth.signOut()`).

## 3. Integračný tok v Next.js

*   **Supabase Auth Helper (`@supabase/auth-helpers-nextjs`):**
    *   Táto knižnica zjednodušuje integráciu Supabase Auth s Next.js, najmä s App Routerom.
    *   Poskytuje funkcie na vytvorenie Supabase klienta pre Server Components, Client Components a API Routes.
    *   Pomáha so správou session a cookies.
*   **Prihlásenie / Registrácia (Frontend):**
    *   Formuláre pre prihlásenie a registráciu v Client Components (napr. v `/app/(auth)/prihlasenie/page.tsx`).
    *   Použitie funkcií Supabase klienta ako `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, `supabase.auth.signInWithOAuth()`.
    *   Spracovanie úspešných odpovedí a chýb.
*   **Ochrana Rout (Client-side & Server-side):**
    *   **Client Components:**
        *   Použitie React Contextu na zdieľanie stavu prihlásenia.
        *   Podmienené renderovanie alebo presmerovanie na základe stavu prihlásenia.
        *   Príklad: Ak používateľ nie je prihlásený a snaží sa dostať do `/kosik`, presmeruje sa na `/prihlasenie`.
    *   **Server Components & API Routes:**
        *   Použitie `@supabase/auth-helpers-nextjs` na získanie session na serveri.
        *   Ak session neexistuje alebo je neplatná, vráti sa chyba alebo presmerovanie.
    *   **Next.js Middleware (`middleware.ts`):**
        *   Centrálne miesto na ochranu viacerých rout.
        *   Kontroluje prítomnosť a platnosť session tokenu (JWT) v cookies.
        *   Môže presmerovať neautentifikovaných používateľov na prihlasovaciu stránku.
        *   Môže tiež spravovať logiku pre overenie veku (ako je popísané v MEMORY[c7d447b3-9b06-4ec6-8367-842630dd90f0]).
            ```typescript
            // Príklad middleware.ts
            import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
            import { NextResponse } from 'next/server';
            import type { NextRequest } from 'next/server';

            export async function middleware(req: NextRequest) {
              const res = NextResponse.next();
              const supabase = createMiddlewareClient({ req, res });
              const { data: { session } } = await supabase.auth.getSession();

              const { pathname } = req.nextUrl;

              // Ochrana admin sekcie
              if (pathname.startsWith('/admin')) {
                if (!session) {
                  return NextResponse.redirect(new URL('/prihlasenie', req.url));
                }
                // Tu by mohla byť aj kontrola role, ak admin rola existuje
                // const { data: { user } } = await supabase.auth.getUser();
                // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
                // if (profile?.role !== 'admin') {
                //   return NextResponse.redirect(new URL('/', req.url)); // Alebo na stránku s chybou prístupu
                // }
              }

              // Ochrana používateľských sekcií (napr. /moj-ucet, /pokladna)
              if (['/moj-ucet', '/pokladna'].some(p => pathname.startsWith(p))) {
                if (!session) {
                  return NextResponse.redirect(new URL('/prihlasenie?redirect_to=' + pathname, req.url));
                }
              }

              // Logika pre overenie veku (zjednodušený príklad, reálna implementácia môže byť v sessionStorage)
              const ageProtectedPaths = ['/produkty', '/kosik', '/pokladna', '/produkt/'];
              const isAgeVerified = req.cookies.get('age_verified')?.value === 'true';

              if (ageProtectedPaths.some(p => pathname.startsWith(p)) && !isAgeVerified && !sessionStorage.getItem('ageVerified')) {
                  // Ak overenie veku prebieha cez sessionStorage, middleware to priamo neuvidí.
                  // Tu by mohla byť logika na strane klienta, alebo presmerovanie na stránku overenia veku,
                  // ak sa rozhodneme spravovať to aj cez cookies pre SSR/middleware.
                  // Pre MEMORY[c7d447b3-9b06-4ec6-8367-842630dd90f0] je to riešené cez sessionStorage, takže middleware by to nemal blokovať priamo,
                  // ale skôr by sa spoliehal na client-side logiku v komponentoch.
              }

              return res;
            }

            export const config = {
              matcher: [
                /*
                 * Match all request paths except for the ones starting with:
                 * - _next/static (static files)
                 * - _next/image (image optimization files)
                 * - favicon.ico (favicon file)
                 * - api (API routes, ak nechceme aby boli chránené globálne tu)
                 */
                '/((?!_next/static|_next/image|favicon.ico|api).*)',
              ],
            };
            ```
*   **Získavanie informácií o používateľovi:**
    *   `supabase.auth.getUser()`: Získa aktuálne prihláseného používateľa.
    *   `supabase.auth.onAuthStateChange((event, session) => { ... })`: Počúva na zmeny stavu autentifikácie (napr. prihlásenie, odhlásenie).

## 4. Autorizácia

Autorizácia určuje, čo môže prihlásený používateľ robiť v aplikácii.

*   **Row Level Security (RLS) v Supabase:**
    *   Hlavný mechanizmus autorizácie pre prístup k dátam.
    *   Politiky definujú, ktoré riadky môže používateľ čítať, vytvárať, upravovať alebo mazať na základe jeho `user_id` alebo role.
    *   Detailnejšie popísané v `DATABASE_SCHEMA_RLS.md`.
*   **Role-Based Access Control (RBAC):**
    *   Používatelia môžu mať priradené role (napr. 'customer', 'admin').
    *   Role sa ukladajú v tabuľke `profiles` (alebo inej dedikovanej tabuľke) a môžu byť pridané ako custom claim do JWT.
    *   **V RLS politikách:** `get_my_claim('user_role') = 'admin'`.
    *   **V UI (Frontend):** Podmienené zobrazovanie prvkov alebo stránok na základe role používateľa (napr. zobrazenie odkazu na administrátorskú sekciu len pre adminov).
    *   **V API Routes / Server Actions:** Kontrola role pred vykonaním citlivých operácií.
*   **Overenie veku (špecifický autorizačný prípad):**
    *   Ako je popísané v MEMORY[c7d447b3-9b06-4ec6-8367-842630dd90f0], prístup k určitým sekciám (`/produkty`, `/kosik`, `/pokladna`, `/produkt/*`) je podmienený potvrdením veku.
    *   Stav overenia sa ukladá v `sessionStorage`.
    *   Logika v komponentoch týchto stránok kontroluje `sessionStorage` a zobrazuje modálne okno, ak overenie neprebehlo alebo bolo zamietnuté.
    *   Odmietnutie alebo zatvorenie modálu presmeruje na domovskú stránku len pri aktívnej interakcii z modálu.

## 5. Bezpečnostné aspekty

*   **Ochrana pred CSRF (Cross-Site Request Forgery):** Next.js má zabudované niektoré ochrany. Pri práci s formulármi a Server Actions je dôležité dodržiavať osvedčené postupy.
*   **Ochrana pred XSS (Cross-Site Scripting):** React by mal escapovať dáta renderované v JSX. Pri použití `dangerouslySetInnerHTML` je potrebná opatrnosť a sanitizácia vstupov.
*   **Bezpečné ukladanie kľúčov:** API kľúče (Supabase `anon_key`, `service_role_key`, Stripe kľúče) musia byť uložené bezpečne v premenných prostredia a nikdy by nemali byť commitované do repozitára (okrem `anon_key`, ktorý je verejný, ale `service_role_key` je extrémne citlivý).
*   **Pravidelné aktualizácie závislostí:** Udržiavanie knižníc (Next.js, Supabase, atď.) aktuálnych pomáha chrániť pred známymi zraniteľnosťami.

## 6. Záver

Kombinácia Supabase Auth, RLS politík v databáze, a správne implementovanej logiky v Next.js (vrátane Middleware a Server Actions) poskytuje robustný systém pre autentifikáciu a autorizáciu používateľov v e-shope Pútec. Dôsledné uplatňovanie týchto princípov je nevyhnutné pre bezpečnosť aplikácie.
