# Frontend Architektúra

## 1. Úvod

Tento dokument popisuje architektúru frontendu pre e-shop Pútec. Frontend je postavený na moderných technológiách s dôrazom na výkon, používateľskú skúsenosť (UX), a udržateľnosť kódu. Využíva Next.js s App Routerom, TypeScript, Tailwind CSS, Shadcn/ui a Framer Motion.

## 2. Kľúčové technológie a ich rola

*   **Next.js (App Router):**
    *   **Server-Side Rendering (SSR) a Static Site Generation (SSG):** Umožňuje rýchlejšie prvé načítanie stránok a lepšiu indexovateľnosť pre vyhľadávače (SEO). Stránky ako produktové listiny alebo detaily produktov môžu byť generované na serveri alebo pri builde, zatiaľ čo dynamickejšie časti (napr. košík) môžu byť renderované na klientovi alebo serveri podľa potreby.
    *   **Routing:** App Router poskytuje súborový systém pre definovanie rout, layoutov a šablón, čo zjednodušuje organizáciu kódu.
    *   **Server Components & Client Components:** Umožňuje optimalizovať, ktorá časť kódu beží na serveri a ktorá na klientovi, čím sa redukuje množstvo JavaScriptu posielaného do prehliadača.
    *   **API Routes:** Jednoduché vytváranie backendových API endpointov priamo v Next.js projekte (napr. pre webhooky od Stripe).
    *   **Middleware:** Umožňuje spúšťať kód pred dokončením požiadavky, napríklad pre autentifikáciu, presmerovania, alebo modifikáciu hlavičiek (napr. pre overenie veku).
*   **TypeScript:**
    *   **Typová bezpečnosť:** Pomáha predchádzať chybám počas vývoja a zlepšuje refaktoring.
    *   **Lepšia čitateľnosť a dokumentácia kódu:** Typy slúžia ako forma dokumentácie.
*   **Tailwind CSS:**
    *   **Utility-First:** Umožňuje rýchle a konzistentné štýlovanie priamo v JSX.
    *   **Prispôsobiteľnosť:** Jednoduchá konfigurácia a rozšírenie základných štýlov.
    *   **Optimalizácia:** Automaticky odstraňuje nepoužité štýly pri builde (PurgeCSS).
*   **Shadcn/ui:**
    *   **Kolekcia komponentov:** Poskytuje sadu prístupných a pekne navrhnutých komponentov (tlačidlá, formuláre, dialógy, atď.), ktoré sa dajú ľahko integrovať a prispôsobiť.
    *   **Nezávislosť:** Komponenty sa kopírujú priamo do projektu, čo dáva plnú kontrolu nad ich kódom.
*   **Framer Motion:**
    *   **Animácie:** Knižnica pre vytváranie plynulých a komplexných animácií a prechodov, ktoré zlepšujú UX.

## 3. Štruktúra komponentov

*   **Atomic Design (inšpirácia):** Aj keď nie striktne, princípy Atomic Design môžu pomôcť pri organizácii komponentov:
    *   **Atoms:** Najmenšie, nedeliteľné UI prvky (napr. `Button`, `Input`, `Icon`). Mnohé z nich poskytuje Shadcn/ui.
    *   **Molecules:** Skupiny atómov tvoriace jednoduché funkčné celky (napr. `SearchInput` zložený z `Input` a `Button`).
    *   **Organisms:** Komplexnejšie UI časti zložené z molekúl a/alebo atómov (napr. `ProductCard`, `NavigationBar`, `ShoppingCart`).
    *   **Templates:** Rozloženie stránky, ktoré definuje štruktúru pre organizmy a molekuly (riešené pomocou Next.js Layouts a Pages).
    *   **Pages:** Konkrétne inštancie šablón s reálnym obsahom (riešené pomocou Next.js Pages).
*   **Umiestnenie komponentov:**
    *   **`/components`**: Globálne, opakovane použiteľné komponenty naprieč celou aplikáciou.
        *   `/components/ui`: Komponenty z Shadcn/ui alebo vlastné základné UI prvky.
        *   `/components/layout`: Komponenty pre hlavné časti layoutu (napr. `Header`, `Footer`, `Sidebar`).
        *   `/components/shared`: Iné zdieľané komponenty.
    *   **`/app/**/_components`**: Komponenty špecifické pre danú routu alebo sekciu aplikácie (napr. `/app/produkty/_components/ProductFilter.tsx`).

## 4. Správa stavu (State Management)

*   **Lokálny stav komponentov:** Pre jednoduché stavy v rámci jedného komponentu sa používa React `useState` a `useReducer`.
*   **Globálny stav:**
    *   **React Context API:** Pre zdieľanie stavu medzi viacerými komponentmi bez nutnosti "prop drillingu". Vhodné pre stavy ako informácie o prihlásenom používateľovi, obsah nákupného košíka, stav overenia veku (`sessionStorage` manažovaný cez context).
    *   **Zustand / Jotai / Recoil (voliteľné):** Pre komplexnejšie globálne stavy, kde Context API nemusí byť dostatočne výkonný alebo flexibilný. Výber závisí od konkrétnych potrieb projektu.
    *   **Server State (dáta z API):**
        *   **React Query (TanStack Query) / SWR:** Odporúčané pre správu serverového stavu, kešovanie, synchronizáciu a aktualizáciu dát z API (Supabase). Tieto knižnice zjednodušujú prácu s asynchrónnymi operáciami.
        *   **Next.js Server Actions:** Pre mutácie dát (vytváranie, úprava, mazanie) priamo zo Server Components alebo Client Components bez nutnosti manuálneho vytvárania API endpointov. Server Actions sa integrujú dobre s `revalidatePath` a `revalidateTag` pre invalidáciu kešu.

## 5. Formuláre

*   **React Hook Form:** Odporúčaná knižnica pre prácu s formulármi. Poskytuje jednoduché API pre validáciu, spracovanie odoslania a správu stavu formulárov s dôrazom na výkon.
*   **Zod / Yup:** Knižnice pre definovanie schém a validáciu dát, často používané v kombinácii s React Hook Form.

## 6. Overenie veku

*   Implementované ako modálne okno, ktoré sa zobrazuje pri pokuse o prístup k chráneným sekciám.
*   Stav overenia (`true`/`false`) sa ukladá do `sessionStorage`.
*   Logika je pravdepodobne spravovaná pomocou React Context a Next.js Middleware pre kontrolu prístupu k routám.

## 7. Lokalizácia (i18n)

*   **URL cesty:** Slovenská verzia (napr. `/produkty`).
*   **Texty v UI:** Preklady textov v komponentoch. Môže sa použiť jednoduchý prístup s JSON súbormi a vlastným providerom, alebo knižnice ako `next-intl` pre pokročilejšie funkcie.

## 8. Optimalizácia výkonu

*   **Code Splitting:** Next.js automaticky rozdeľuje kód na menšie časti, takže sa načítava len potrebný kód pre danú stránku.
*   **Lazy Loading:** Komponenty a obrázky, ktoré nie sú okamžite viditeľné, sa načítavajú neskôr (`next/image` pre optimalizáciu obrázkov, `next/dynamic` pre dynamický import komponentov).
*   **Memoization:** Použitie `React.memo`, `useMemo`, `useCallback` na zabránenie zbytočným re-renderom komponentov.
*   **Server Components:** Minimalizácia JavaScriptu posielaného klientovi.

## 9. Testovanie

*   **Jednotkové testy (Unit Tests):** Testovanie jednotlivých funkcií a komponentov v izolácii (napr. pomocou Jest, React Testing Library).
*   **Integračné testy (Integration Tests):** Testovanie interakcie medzi viacerými komponentmi.
*   **End-to-End (E2E) testy:** Testovanie celých používateľských scenárov (napr. pomocou Cypress, Playwright).

## 10. Záver

Táto architektúra poskytuje pevný základ pre vývoj moderného, výkonného a udržateľného e-shopu. Dôležité je dodržiavať princípy čistého kódu, modularity a pravidelne revidovať architektonické rozhodnutia podľa potrieb projektu.
