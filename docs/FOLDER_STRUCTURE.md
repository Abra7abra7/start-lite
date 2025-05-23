# Štruktúra priečinkov a súborov

## 1. Úvod

Tento dokument popisuje typickú a odporúčanú štruktúru priečinkov a súborov pre projekt e-shopu Pútec, postaveného na Next.js (s App Routerom). Cieľom je zabezpečiť prehľadnosť, modularitu a jednoduchú orientáciu v kóde.

## 2. Hlavná štruktúra projektu (koreňový adresár)

Koreňový adresár projektu obsahuje nasledujúce kľúčové priečinky a súbory:

*   **`/app`**: Jadro aplikácie využívajúce Next.js App Router. Obsahuje všetky routy (stránky), layouty, a komponenty špecifické pre jednotlivé routy.
    *   Tu sa definujú jednotlivé stránky a ich štruktúra (napr. `/app/produkty/page.tsx`, `/app/kosik/layout.tsx`).
    *   Môže obsahovať aj API routes (napr. `/app/api/webhooks/stripe/route.tsx`).
*   **`/components`**: Globálne, opakovane použiteľné UI komponenty, ktoré nie sú viazané na konkrétnu routu. Napríklad tlačidlá, modálne okná, navigačné prvky.
    *   **`/components/ui`**: Často sa tu umiestňujú komponenty z knižníc ako Shadcn/ui.
*   **`/lib`**: Pomocné funkcie, utility, konfigurácie externých knižníc a logika, ktorá nie je priamo viazaná na UI. Príklady:
    *   Klient pre Supabase.
    *   Funkcie pre prácu so Stripe.
    *   Funkcie pre posielanie emailov (napr. `send-order-emails.ts`).
    *   Formátovanie dát, validácie.
*   **`/public`**: Statické súbory, ktoré sú priamo prístupné cez web server. Napríklad obrázky, ikony (favicon), fonty, a iné assety.
*   **`/styles`** (alebo priamo v `/app`):
    *   `globals.css`: Globálne CSS štýly, importy fontov, CSS reset.
*   **`/types`**: TypeScript typové definície. Môže obsahovať globálne typy alebo typy generované pre Supabase (napr. `supabase.ts`).
*   **`/docs`**: Priečinok s dokumentáciou projektu (kde sa nachádza aj tento súbor).
*   **Konfiguračné súbory (príklady):**
    *   `package.json`: Zoznam závislostí projektu a skripty.
    *   `tsconfig.json`: Konfigurácia TypeScript kompilátora.
    *   `next.config.js` (alebo `.mjs`): Konfigurácia Next.js.
    *   `tailwind.config.js` (alebo `.ts`): Konfigurácia Tailwind CSS.
    *   `.env` alebo `.env.local`: Súbory s premennými prostredia (API kľúče, databázové pripojenia - **nikdy necommitovať do Git repozitára, ak obsahujú citlivé údaje!**).
    *   `middleware.ts`: Pre Next.js middleware (napr. pre autentifikáciu, lokalizáciu, overenie veku).

## 3. Detailná štruktúra priečinka `/app`

Priečinok `/app` je kľúčový pre fungovanie Next.js aplikácie s App Routerom:

*   **Konvencie súborov:**
    *   `page.tsx`: Hlavný komponent pre danú routu (stránku).
    *   `layout.tsx`: Komponent definujúci spoločný layout pre routu a jej pod-routy.
    *   `loading.tsx`: UI komponent zobrazovaný počas načítavania obsahu routy.
    *   `error.tsx`: UI komponent pre zobrazenie chýb v rámci routy.
    *   `template.tsx`: Podobné ako layout, ale reinštancializuje sa pri každej navigácii.
    *   `route.ts` (v rámci `api` podadresárov): Pre definovanie backend API endpointov.
*   **Route Groups (`(...)`):** Používajú sa na organizáciu rout bez ovplyvnenia URL cesty. Napríklad:
    *   `(auth)`: Pre routy týkajúce sa autentifikácie (`/prihlasenie`, `/registracia`), ktoré môžu mať spoločný layout.
    *   `(main)`: Pre hlavné stránky aplikácie s iným spoločným layoutom.
    *   `(protected)`: Pre stránky vyžadujúce prihlásenie alebo iné overenie (napr. veku).
*   **Dynamické routy (`[...]` alebo `[[...]]`):**
    *   `/app/produkt/[idProduktu]/page.tsx`: Stránka pre detail produktu, kde `idProduktu` je dynamický parameter.
*   **Administrátorská sekcia:**
    *   `/app/admin/...`: Všetky routy a logika pre administrátorské rozhranie.
    *   `/app/admin/_components`: Komponenty špecifické pre administrátorskú časť.
    *   `/app/admin/_actions`: Server Actions pre administrátorskú časť (napr. `warehouseActions.ts`).
*   **Lokalizácia:**
    *   URL cesty v slovenskom jazyku (napr. `/produkty`, `/kosik`) sú priamo názvy priečinkov v `/app`.
    *   Alternatívne, pre komplexnejšiu i18n, sa môže použiť `next-intl` alebo podobná knižnica a dynamické segmenty s locale.

## 4. Ďalšie dôležité priečinky (voliteľné, podľa potreby)

*   **`/hooks`**: Pre vlastné React hooks (napr. `useAuth`, `useCart`).
*   **`/contexts`**: Pre React Context API providers (napr. `AuthContext`, `CartContext`).
*   **`/services`**: Pre logiku komunikácie s externými API, ak je rozsiahlejšia a oddelená od `/lib`.
*   **`/utils`**: Podobné ako `/lib`, niekedy sa používa pre menšie, čisto funkcionálne utility.

## 5. Záver

Konzistentná a logická štruktúra projektu je základom pre jeho dlhodobú udržateľnosť a efektívny vývoj v tíme. Táto navrhovaná štruktúra vychádza z osvedčených postupov pre Next.js aplikácie a mala by poskytnúť dobrý východiskový bod pre e-shop Pútec.
