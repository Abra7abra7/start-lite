

**Popis Projektu: Vino Putec**

Cieľom projektu je vytvoriť moderný e-shop zameraný na predaj vína a súvisiaceho sortimentu. Ponuka bude zahŕňať:

*   Červené vína
*   Biele vína
*   Ružové vína
*   Sekty
*   Vínne sety
*   Príslušenstvo (napr. otvárače, poháre, karafy)

**Platobné Metódy:**
Zákazníci budú mať na výber dve možnosti platby:
1.  **Stripe:** Platba kartou online.
2.  **Dobierka:** Platba v hotovosti alebo kartou pri prevzatí tovaru od kuriéra.

**Administrátorské Rozhranie (Admin Dashboard):**
Súčasťou projektu bude jednoduchý, ale funkčný admin dashboard, ktorý umožní:
1.  **Správa Produktov (Vín):** CRUD operácie (Vytvoriť, Čítať, Upraviť, Zmazať) pre všetky produkty v ponuke.
2.  **Správa Objednávok:** Prehľad všetkých objednávok, možnosť zobrazenia detailov a aktualizácie ich stavu (napr. Prijatá, Spracováva sa, Odoslaná, Zrušená, Doručená).
3.  **Správa Skladových Zásob:**
    *   CRUD operácie pre skladové zásoby.
    *    evidencia zásob naprieč **4 definovanými skladmi**.
    *    Vykonávanie skladových operácií: naskladnenie (príjem tovaru), presun medzi skladmi, odpísanie (napr. z dôvodu poškodenia alebo expirácie).

---

**Použité Technológie (Tech Stack)**

Tento projekt bude využívať nasledujúce technológie:

1.  **Základný Framework a Runtime Prostredie:**
    *   **Next.js 14.x**: Hlavný framework pre vývoj aplikácie, poskytuje renderovanie na strane servera (SSR), routovanie a API funkcionality. (Verzia upresnená podľa aktuálnej stabilnej verzie pri štarte projektu).
    *   **React 18**: Základná UI knižnica pre tvorbu komponentov.
    *   **TypeScript**: Pre typovo bezpečný vývoj.

2.  **Autentifikácia a Správa Používateľov:**
    *   **Clerk**: Implementované cez `@clerk/nextjs` pre riešenie autentifikácie a správy používateľov (primárne pre adminov, prípadne registrovaných zákazníkov).

3.  **Databáza a Backend:**
    *   **Supabase**: Použité ako hlavná databáza a backendová služba.
    *   Databázová schéma bude obsahovať tabuľky minimálne pre:
        *   `zakaznici` (customers) - ak bude potrebná registrácia
        *   `produkty` (products) - vrátane detailov o víne (typ, ročník, výrobca, popis...)
        *   `ceny` (prices)
        *   `objednavky` (orders)
        *   `polozky_objednavky` (order_items)
        *   `sklady` (warehouses) - informácie o 4 skladoch
        *   `skladove_zasoby` (inventory) - prepojenie produktov, skladov a množstva
        *   `skladove_pohyby` (inventory_movements) - záznamy o naskladnení, presune, odpise
    *   Row Level Security (RLS) bude povolené pre ochranu dát.
    *   Vlastné typy pre dáta špecifické pre e-shop (napr. stavy objednávok, typy skladových pohybov).

4.  **UI Komponenty a Štýlovanie:**
    *   **NextUI**: Moderná knižnica komponentov postavená na React Aria a Tailwind CSS pre krásny a responzívny dizajn používateľského rozhrania e-shopu aj admin dashboardu.
    *   **(Alternatíva/Doplnok) shadcn/ui**: Komponenty vytvorené pomocou Tailwind CSS a Radix UI (Môže byť použité popri alebo namiesto NextUI podľa preferencie dizajnu).
    *   **Radix UI**: Rozsiahle použitie prístupných komponentov (ak sa použije shadcn/ui alebo priamo):
        *   Dialog, Popover, Tooltip
        *   Navigačné menu
        *   Formulárové prvky (Checkbox, Radio, Select)
        *   Layout komponenty (Accordion, Tabs)
    *   **Tailwind CSS**: Pre štýlovanie pomocou utility tried.
        *   Používa `tailwindcss-animate` pre animácie.
        *   Vlastná konfigurácia cez `tailwind.config.ts`.
    *   **Framer Motion**: Pre pokročilé animácie.
    *   **Lucide React**: Pre ikony.
    *   **Embla Carousel**: Pre karuselové/slider komponenty (napr. na hlavnej stránke).
    *   **Sonner**: Pre toast notifikácie (napr. úspešné pridanie do košíka, chyba pri platbe).
    *   **class-variance-authority**: Pre správu variantov komponentov.
    *   **clsx** a **tailwind-merge**: Pre podmienené spájanie názvov CSS tried.

5.  **Spracovanie Formulárov a Validácia:**
    *   **React Hook Form**: Pre správu formulárov (napr. checkout, admin formuláre).
    *   **Zod**: Pre validáciu schém (dát z formulárov, API odpovedí).
    *   **@hookform/resolvers**: Pre integráciu Zod s React Hook Form.

6.  **Spracovanie Dátumov a Grafy:**
    *   **date-fns**: Pre manipuláciu s dátumami (napr. dátum objednávky, expirácia).
    *   **React Day Picker**: Pre komponenty na výber dátumu (napr. v admin rozhraní pre filtre).
    *   **Recharts**: Pre vizualizáciu dát a grafy v admin dashboarde (napr. prehľad predajov, stav zásob).

7.  **Vývojárske Nástroje:**
    *   **ESLint**: Pre kontrolu kvality kódu (linting).
    *   **Prettier**: Pre automatické formátovanie kódu (s Tailwind pluginom).
    *   **TypeScript**: Pre statickú typovú kontrolu.
    *   **PostCSS**: Pre spracovanie CSS.

8.  **UI/UX Funkcionality:**
    *   **next-themes**: Pre možnosť prepínania tmavej/svetlej témy (voliteľné).
    *   **react-resizable-panels**: Pre panely s meniteľnou veľkosťou (môže byť užitočné v admin dashboarde).
    *   **vaul**: Pre ďalšie UI komponenty (napr. drawer).
    *   **cmdk**: Pre funkcionalitu príkazovej palety (môže zrýchliť prácu v admin rozhraní).

---

**Zhrnutie Projektu:**

Projekt je koncipovaný ako moderná e-commerce aplikácia s týmito kľúčovými vlastnosťami:

*   Kompletný systém pre správu produktov (vín), objednávok a skladových zásob.
*   Integrácia platobných metód (Stripe, Dobierka).
*   Zabezpečená autentifikácia pre administrátorov.
*   Typovo bezpečný vývoj s TypeScriptom.
*   Moderné a responzívne používateľské rozhranie (NextUI).
*   Schopnosti renderovania na strane servera (SSR) pre lepší výkon a SEO.
*   API routes pre backendovú funkcionalitu.
*   Databáza (Supabase) s primeranými bezpečnostnými opatreniami (RLS).
*   Funkčný admin dashboard pre efektívnu správu e-shopu.

Tento technologický balík poskytuje robustný základ pre vybudovanie škálovateľnej, bezpečnej a používateľsky prívetivej webovej aplikácie (e-shopu) so všetkými modernými funkciami potrebnými pre úspešný online predaj vína.