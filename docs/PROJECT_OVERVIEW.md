# Prehľad projektu: E-shop Pútec

## 1. Úvod

`vino-putec` je projekt moderného e-shopu, primárne určeného pre vinárstvo "Pútec". Hlavným cieľom je vytvoriť robustnú, škálovateľnú a používateľsky prívetivú platformu pre online predaj produktov. Dôraz je kladený na moderné technológie, responzívny dizajn, vynikajúcu používateľskú skúsenosť (UX), lokalizáciu do slovenského jazyka a implementáciu špecifických funkcií, ako je napríklad overenie veku pre prístup k určitým častiam stránky.

## 2. Použité technológie

Projekt využíva nasledujúci technologický zásobník:

*   **Frontend:**
    *   **Next.js:** Popredný React framework, ktorý umožňuje server-side rendering (SSR) a static site generation (SSG). To prispieva k lepšiemu SEO, rýchlejšiemu načítaniu stránok a celkovo lepšiemu výkonu.
    *   **Tailwind CSS:** Utility-first CSS framework, ktorý umožňuje rýchly a efektívny vývoj responzívneho a moderného dizajnu priamo v HTML/JSX štruktúre.
    *   **Shadcn/ui:** Kolekcia krásne navrhnutých a prispôsobiteľných UI komponentov postavených na Tailwind CSS a Radix UI. Komponenty sú plne dostupné (accessibility-first).
    *   **Framer Motion:** Výkonná knižnica pre tvorbu plynulých animácií a prechodov v React aplikáciách, čím sa zlepšuje interaktivita a vizuálna príťažlivosť.
*   **Backend & Databáza:**
    *   **Supabase:** Open-source alternatíva k Firebase, postavená na PostgreSQL. Poskytuje komplexné riešenie vrátane databázy, autentifikácie, úložiska súborov (storage) a real-time funkcií. Pre zabezpečenie dát na úrovni databázy sa využíva Row Level Security (RLS).
*   **Platobná brána:**
    *   **Stripe:** Osvedčená a bezpečná platforma pre spracovanie online platieb, ktorá ponúka širokú škálu nástrojov pre integráciu a správu transakcií.
*   **Programovací jazyk:**
    *   **TypeScript:** Staticky typovaný nadmnožina JavaScriptu. Zvyšuje robustnosť kódu, zlepšuje čitateľnosť a uľahčuje údržbu rozsiahlych aplikácií vďaka včasnému odhaleniu chýb.

## 3. Sitemap (Štruktúra stránok)

Predpokladaná štruktúra stránok e-shopu s ohľadom na slovenskú lokalizáciu URL ciest:

*   `/` - Domovská stránka (Homepage)
*   **Produkty:**
    *   `/produkty` - Prehľad všetkých produktov (chránené overením veku)
    *   `/produkt/{idProduktu}` - Detail konkrétneho produktu (chránené overením veku)
*   **Nákupný proces:**
    *   `/kosik` - Nákupný košík (chránené overením veku)
    *   `/pokladna` - Proces objednávky a platby (chránené overením veku)
    *   `/objednavka-potvrdena` - Stránka s potvrdením úspešnej objednávky
*   **Používateľský účet:**
    *   `/prihlasenie` - Stránka pre prihlásenie existujúceho používateľa
    *   `/registracia` - Stránka pre registráciu nového používateľa
    *   `/moj-ucet` - Používateľský profil, história objednávok, správa údajov
*   **Informačné stránky:**
    *   `/obchodne-podmienky` - Všeobecné obchodné podmienky
    *   `/ochrana-osobnych-udajov` - Zásady ochrany osobných údajov (GDPR)
    *   `/kontakt` - Kontaktné informácie a formulár
*   **Administrátorská sekcia (príklady):**
    *   `/admin` - Hlavný panel administrácie
    *   `/admin/produkty` - Správa produktov (pridávanie, úprava, mazanie)
    *   `/admin/objednavky` - Prehľad a správa objednávok
    *   `/admin/sklady` - Správa skladových zásob a inventára
    *   `/admin/pouzivatelia` - Správa používateľských účtov

## 4. Štýlovanie a Dizajn

*   **Primárny nástroj:** Tailwind CSS sa používa pre väčšinu štýlovania, čo umožňuje rýchle prototypovanie a konzistentný vzhľad.
*   **Komponenty:** Shadcn/ui poskytuje sadu predpripravených, ale plne prispôsobiteľných komponentov, ktoré urýchľujú vývoj UI.
*   **Globálne štýly:** Základné globálne štýly, reset CSS, alebo definície pre fonty môžu byť umiestnené v súbore ako `app/globals.css`.
*   **Responzivita:** Dizajn je od začiatku navrhovaný s ohľadom na responzivitu pre rôzne veľkosti obrazoviek (desktop, tablet, mobil).

## 5. Plán dokumentácie

Tento dokument je úvodným prehľadom. Plánujeme postupne dopĺňať detailnejšiu dokumentáciu pre jednotlivé aspekty projektu, vrátane:

*   Štruktúra priečinkov a súborov
*   Detailný popis Frontend architektúry
*   Detailný popis Backend architektúry a Supabase integrácie
*   Schéma databázy a RLS politiky
*   Proces autentifikácie a autorizácie
*   Integrácia platobnej brány Stripe
*   Návod na nasadenie (Deployment)
*   Konvencie kódovania a prispievania do projektu

---

Tento dokument bude slúžiť ako centrálny bod pre pochopenie projektu `vino-putec`.
