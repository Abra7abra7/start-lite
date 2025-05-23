# Plán Vylepšení pre E-shop Pútec

Tento plán vychádza z návrhov na zlepšenie vizuálnej stránky, funkčnosti, modularity, mobilnej optimalizácie a konverzného potenciálu e-shopu Pútec.

## Fáza 1: Základné Vizuálne a UX Vylepšenia

**Cieľ:** Vytvoriť moderný, profesionálny a dôveryhodný prvý dojem.

1.  **Produktová Prezentácia:**
    *   [ ] **Úloha:** Zabezpečiť/vytvoriť profesionálne produktové fotografie a videá pre kľúčový sortiment vín.
    *   [ ] **Úloha:** Dôsledne implementovať `next/image` pre optimalizované zobrazenie všetkých obrázkov na webe.
2.  **Dizajn a Branding:**
    *   [ ] **Úloha:** Finalizovať a konzistentne aplikovať farebnú paletu a typografiu v súlade s brandingom "Pútec" naprieč celým webom.
    *   [ ] **Úloha:** Prejsť všetky stránky a zabezpečiť čistý a elegantný dizajn s dostatkom bieleho priestoru (využitie Shadcn/ui a Tailwind CSS).
3.  **Navigácia:**
    *   [ ] **Úloha:** Navrhnúť a implementovať intuitívne hlavné menu (vrátane prehľadných podkategórií vín – napr. podľa farby, typu, regiónu).
    *   [ ] **Úloha:** Implementovať výrazné a funkčné fulltextové vyhľadávacie pole s našeptávačom.
    *   [ ] **Úloha:** Vytvoriť komplexnú a prehľadnú pätičku s odkazmi na obchodné podmienky, ochranu os. údajov, kontakt, sociálne siete atď.
4.  **Signály Dôveryhodnosti:**
    *   [ ] **Úloha:** Identifikovať a strategicky umiestniť signály dôvery (napr. ocenenia vinárstva, certifikáty kvality, logá bezpečnej platby Stripe) na relevantné miesta (domovská stránka, detail produktu, pokladňa).
    *   [ ] **Úloha:** Vytvoriť/vylepšiť sekciu "O nás" s príbehom vinárstva a jasne zobraziť kontaktné informácie.
5.  **Prístupnosť (Accessibility):**
    *   [ ] **Úloha:** Vykonávať priebežný audit a testovanie webu na základné princípy prístupnosti (WCAG AA) – kontrast, ovládanie klávesnicou, sémantika HTML, ARIA atribúty.

## Fáza 2: Optimalizácia Funkčnosti pre Konverzie

**Cieľ:** Zjednodušiť nákupný proces a maximalizovať počet dokončených objednávok.

1.  **Domovská Stránka (`/`):**
    *   [ ] **Úloha:** Vytvoriť pútavú "hero" sekciu s kvalitným vizuálom a jasným call-to-action.
    *   [ ] **Úloha:** Implementovať dynamické sekcie: "Najpredávanejšie vína", "Nové prírastky", "Akciové ponuky", "Odporúčame".
2.  **Výpis Produktov (`/produkty`):**
    *   [ ] **Úloha:** Implementovať pokročilé a intuitívne filtrovanie produktov (podľa druhu, ceny, ročníka, regiónu, cukornatosti, výrobcu atď.).
    *   [ ] **Úloha:** Implementovať viacero možností triedenia produktov (podľa ceny, popularity, názvu, noviniek).
    *   [ ] **Úloha:** Pridať funkciu "Rýchly náhľad" (Quick View) a "Pridať do košíka" priamo z výpisu produktov.
3.  **Detail Produktu (`/produkt/{id}`):**
    *   [ ] **Úloha:** Zabezpečiť komplexné produktové informácie (charakteristika, odporúčané jedlá, analytické údaje) a kvalitnú galériu obrázkov s možnosťou zoomu.
    *   [ ] **Úloha:** Jasne zobraziť dostupnosť na sklade (presný počet kusov alebo status).
    *   [ ] **Úloha:** Implementovať sekciu "Zákazníci tiež kúpili" alebo "Podobné vína" na podporu cross-sell/up-sell.
    *   [ ] **Úloha:** (Voliteľné, zvážiť neskôr) Implementovať systém recenzií a hodnotení produktov.
4.  **Nákupný Košík (`/kosik`):**
    *   [ ] **Úloha:** Optimalizovať prehľadnosť, jednoduchosť úprav množstva a odstraňovania položiek v košíku.
    *   [ ] **Úloha:** Zobraziť odhadované náklady na dopravu (ak je to možné pred zadaním adresy).
5.  **Pokladňa (`/pokladna`):**
    *   [ ] **Úloha:** Navrhnúť a implementovať zjednodušený proces pokladne (ideálne jednostránkový alebo minimálny počet krokov s jasným indikátorom progresu).
    *   [ ] **Úloha:** Implementovať **nákup bez registrácie (Guest Checkout)** ako predvolenú alebo výrazne propagovanú možnosť.
    *   [ ] **Úloha:** Minimalizovať počet formulárových polí len na nevyhnutné.
    *   [ ] **Úloha:** (Voliteľné) Zvážiť integráciu automatického dopĺňania adresy (napr. cez Google Places API alebo lokálne riešenie).
6.  **Overenie Veku:**
    *   [ ] **Úloha:** Skontrolovať a prípadne vylepšiť dizajn a UX existujúceho modálneho okna pre overenie veku, aby bolo čo najmenej rušivé a jasné.
    *   [ ] **Úloha:** (Voliteľné) Zvážiť možnosť "Zapamätať si ma na tomto zariadení" pre overenie veku (s ohľadom na legislatívu a GDPR).

## Fáza 3: Mobile-First Optimalizácia

**Cieľ:** Zabezpečiť bezchybný, rýchly a intuitívny zážitok na mobilných zariadeniach.

1.  **Responzívny Dizajn a Výkon:**
    *   [ ] **Úloha:** Dôkladne testovať a optimalizovať všetky stránky, komponenty a funkcie na rôznych mobilných zariadeniach a prehliadačoch.
    *   [ ] **Úloha:** Zamerať sa na rýchlosť načítania na mobilných zariadeniach (optimalizácia obrázkov, lazy loading, minimalizácia kódu).
2.  **Optimalizácia pre Dotyk:**
    *   [ ] **Úloha:** Overiť veľkosť a rozmiestnenie interaktívnych prvkov (tlačidlá, odkazy, formulárové polia) pre pohodlné dotykové ovládanie.
3.  **Mobilná Navigácia:**
    *   [ ] **Úloha:** Implementovať/optimalizovať mobilné menu (napr. hamburger menu) a zvážiť perzistentnú spodnú navigačnú lištu pre kľúčové akcie (Domov, Vyhľadávanie, Košík, Účet).

## Fáza 4: Platobný Proces a Komunikácia

**Cieľ:** Zabezpečiť hladký, bezpečný a transparentný platobný proces a efektívnu automatizovanú komunikáciu so zákazníkom.

1.  **Integrácia Stripe Checkout (Presmerovanie):**
    *   [ ] **Úloha:** Implementovať vytvorenie Stripe Checkout Session na strane servera (pomocou Next.js Server Action) pri potvrdení objednávky v pokladni.
    *   [ ] **Úloha:** Implementovať presmerovanie používateľa na Stripe Checkout stránku na strane klienta.
    *   [ ] **Úloha:** Dôkladne nakonfigurovať `success_url` (napr. `/objednavka-potvrdena`) a `cancel_url` (napr. späť do pokladne s informáciou) v Stripe Checkout Session.
2.  **Spracovanie Webhookov od Stripe:**
    *   [ ] **Úloha:** Zabezpečiť robustné a bezpečné spracovanie webhooku `checkout.session.completed` v API route (`/app/api/webhooks/stripe/route.tsx`), vrátane dôkladného overenia Stripe podpisu.
    *   [ ] **Úloha:** V rámci spracovania webhooku:
        *   [ ] Aktualizovať stav objednávky v Supabase databáze (napr. `status: 'zaplatená'`).
        *   [ ] Implementovať logiku pre úpravu skladových zásob produktov.
        *   [ ] Spustiť proces odosielania potvrdzovacích emailov.
3.  **Emailové Notifikácie:**
    *   [ ] **Úloha:** Navrhnúť a implementovať responzívne HTML šablóny pre potvrdzovací email klientovi (zhrnutie objednávky, cena, doručovacia adresa, poďakovanie, odhadovaný termín doručenia).
    *   [ ] **Úloha:** Navrhnúť a implementovať responzívne HTML šablóny pre notifikačný email majiteľovi/administrátorovi e-shopu (detail novej objednávky).
    *   [ ] **Úloha:** Zabezpečiť spoľahlivé odosielanie emailov cez nakonfigurovanú službu (napr. Resend, ako je naznačené v `lib/send-order-emails.ts`).

## Fáza 5: Refaktoring, Udržateľnosť a Rozšírenie (Priebežne)

**Cieľ:** Udržiavať kód čistý, modulárny, testovateľný a ľahko spravovateľný pre budúci rozvoj.

1.  **Komponentová Architektúra:**
    *   [ ] **Úloha:** Priebežne revidovať a refaktorovať kód s cieľom vytvárať malé, jednoúčelové a opakovane použiteľné komponenty (Atomic Design princípy).
2.  **Využitie Next.js Funkcií:**
    *   [ ] **Úloha:** Identifikovať miesta, kde je možné efektívne využiť Next.js Server Actions na zjednodušenie interakcie frontend-backend a zníženie počtu API routes.
3.  **Správa Závislostí:**
    *   [ ] **Úloha:** Pravidelne kontrolovať, aktualizovať a odstraňovať nepoužívané závislosti projektu.
4.  **Dokumentácia Kódu a Projektu:**
    *   [ ] **Úloha:** Priebežne aktualizovať projektovú dokumentáciu v priečinku `/docs` so všetkými významnými zmenami, novými funkciami a architektonickými rozhodnutiami.
    *   [ ] **Úloha:** Písať JSDoc/TSDoc komentáre pre kľúčové funkcie a komponenty.
5.  **Testovanie:**
    *   [ ] **Úloha:** Postupne pridávať jednotkové testy (napr. s Jest/Vitest a React Testing Library) pre kritické funkcie a komponenty.
    *   [ ] **Úloha:** Zvážiť implementáciu integračných testov pre kľúčové používateľské scenáre.

---

Tento plán je navrhnutý ako východiskový bod. Jednotlivé úlohy môžu byť ďalej rozdelené a prioritizované podľa aktuálnych potrieb projektu. Odporúčam používať nástroj na správu úloh (napr. GitHub Issues, Trello, Jira) na sledovanie postupu a priraďovanie zodpovedností.
