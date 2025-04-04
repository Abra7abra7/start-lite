
**Dokumentácia: Best Practices pre Next.js Aplikácie (Slovensko)**

**Verzia:** 1.0
**Dátum:** 24. 5. 2024

**Obsah:**

1.  **Úvodné Princípy**
    *   1.1. Mobile-First
    *   1.2. Rýchlosť Načítania (Performance)
    *   1.3. User Experience (UX)
2.  **SEO pre Slovenský Trh**
    *   2.1. Technické SEO v Next.js
    *   2.2. On-Page SEO
    *   2.3. Lokálne SEO (Slovensko)
    *   2.4. Štruktúrované Dáta (Schema Markup)
    *   2.5. Obsahová Stratégia
3.  **Lokalizácia pre Slovensko (sk-SK)**
    *   3.1. Nastavenie Jazyka a Smerovanie (Routing)
    *   3.2. Preklady Obsahu
    *   3.3. Formátovanie (Dátumy, Čísla, Mena)
    *   3.4. `hreflang` Atribúty
4.  **Mobile-First Implementácia**
    *   4.1. Responzívny Dizajn
    *   4.2. Dotykové Ovládanie (Touch Targets)
    *   4.3. Výkon na Mobilných Zariadeniach
    *   4.4. Testovanie
5.  **Optimalizácia a Načítanie Obrázkov**
    *   5.1. Využitie Next.js `<Image>` Komponentu
    *   5.2. Správne Formáty (WebP, AVIF)
    *   5.3. Responzívne Obrázky (`sizes` prop)
    *   5.4. Lazy Loading
    *   5.5. Placeholders (Blur, Base64)
    *   5.6. CDN (Content Delivery Network)
6.  **Rýchlosť Načítania (Performance Optimization)**
    *   6.1. Stratégie Renderovania (SSR, SSG, ISR, CSR)
    *   6.2. Code Splitting
    *   6.3. Optimalizácia JavaScript Bundle
    *   6.4. Caching Stratégie
    *   6.5. Optimalizácia Fontov (`next/font`)
    *   6.6. Minimalizácia Third-Party Skriptov
    *   6.7. Core Web Vitals (LCP, FID/INP, CLS)
7.  **Kľúčové Aspekty User Experience (UX)**
    *   7.1. Intuitívna Navigácia
    *   7.2. Jasné Call-to-Actions (CTA)
    *   7.3. Čitateľnosť a Prístupnosť (Accessibility - WCAG)
    *   7.4. Spätná Väzba a Chybové Stavy
    *   7.5. Konzistentnosť
8.  **Nástroje a Zdroje**

---

**1. Úvodné Princípy**

Tieto princípy by mali viesť celý vývojový proces:

*   **1.1. Mobile-First:** Dizajnujte a vyvíjajte primárne pre mobilné zariadenia, potom škálujte pre väčšie obrazovky. Väčšina používateľov na Slovensku pristupuje na web cez mobil.
*   **1.2. Rýchlosť Načítania (Performance):** Rýchla stránka je kritická pre udržanie používateľov a pre SEO. Každá milisekunda sa počíta.
*   **1.3. User Experience (UX):** Stránka musí byť jednoduchá na používanie, intuitívna a príjemná. Dobré UX vedie ku konverziám a lojalite.

**2. SEO pre Slovenský Trh**

Optimalizácia pre vyhľadávače (najmä Google) je kľúčová pre organickú návštevnosť.

*   **2.1. Technické SEO v Next.js:**
    *   **Metadata:** Používajte vstavanú **Metadata API** (v App Router) alebo komponent `<Head>` (`next/head` v Pages Router) na dynamické nastavenie `<title>`, `<meta name="description">`, `<meta name="robots">` a Open Graph tagov (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) pre každú stránku. Titulky a popisy musia byť unikátne a v slovenčine.
    *   **Kanonické URL:** Nastavte `canonical` URL tag, aby ste predišli problémom s duplicitným obsahom (`<link rel="canonical" href="...">`).
    *   **Sitemap.xml:** Generujte dynamickú `sitemap.xml` (napr. pomocou API route alebo knižnice ako `next-sitemap`) a odošlite ju do Google Search Console. Zahrňte všetky relevantné stránky.
    *   **Robots.txt:** Vytvorte súbor `public/robots.txt` na riadenie prístupu crawlerov. Povoľte indexáciu dôležitých častí a blokujte nepodstatné (napr. administráciu). Uveďte cestu k sitemap.
    *   **Server-Side Rendering (SSR) / Static Site Generation (SSG):** Preferujte SSR alebo SSG pre dôležité stránky, aby mali vyhľadávače prístup k plne renderovanému HTML obsahu. ISR (Incremental Static Regeneration) je dobrý kompromis.

*   **2.2. On-Page SEO:**
    *   **Kľúčové Slová:** Identifikujte relevantné slovenské kľúčové slová a frázy (long-tail) pomocou nástrojov (Google Keyword Planner, Ahrefs, SEMrush) a prirodzene ich integrujte do titulkov, popisov, nadpisov (H1-H6) a hlavného textu.
    *   **Štruktúra Nadpisov:** Používajte logickú hierarchiu nadpisov (jeden H1 na stránku, následne H2, H3...).
    *   **Interné Prelinkovanie:** Prelinkujte relevantné stránky v rámci vášho webu pomocou popisných anchor textov v slovenčine.
    *   **Alt Texty Obrázkov:** Vždy pridávajte popisné `alt` atribúty k obrázkom v slovenčine. Pomáha to SEO aj prístupnosti.

*   **2.3. Lokálne SEO (Slovensko):**
    *   **Google Business Profile:** Ak má firma fyzickú prevádzku alebo poskytuje služby v konkrétnej oblasti (napr. vinárstvo v Pezinku), vytvorte a optimalizujte profil Google Moja Firma (Google Business Profile). Uveďte presnú adresu, otváracie hodiny, kontakty, pridajte fotky a zbierajte recenzie.
    *   **Lokálne Kľúčové Slová:** Používajte kľúčové slová s geografickým zacielením (napr. "degustácia vína Pezinok", "ubytovanie Malokarpatská oblasť", "Pálava Vinosady").
    *   **Lokálne Adresáre:** Zvážte zápis do relevantných slovenských online katalógov a adresárov (napr. Zoznam.sk, Azet.sk - overte si ich aktuálnu relevanciu a kvalitu).
    *   **Kontaktné Informácie:** Uistite sa, že názov firmy, adresa a telefónne číslo (NAP - Name, Address, Phone) sú konzistentne uvedené na webe (napr. v pätičke) a zhodujú sa s Google Business Profile a inými záznamami.

*   **2.4. Štruktúrované Dáta (Schema Markup):**
    *   Implementujte relevantné schémy (JSON-LD je preferovaný formát) na označenie obsahu pre vyhľadávače. Príklady:
        *   `Organization` / `LocalBusiness` (pre vinárstvo)
        *   `Product` (pre jednotlivé vína, vrátane ceny, dostupnosti, recenzií)
        *   `Event` (pre degustácie)
        *   `BreadcrumbList` (pre navigáciu)
        *   `FAQPage` (pre často kladené otázky)
    *   Použite Google Rich Results Test na validáciu.

*   **2.5. Obsahová Stratégia:**
    *   Tvorba kvalitného, originálneho a relevantného obsahu **v slovenčine**, ktorý rieši potreby a otázky cieľovej skupiny (napr. blog o vinárstve, tipy na párovanie vína s jedlom, informácie o regióne).

**3. Lokalizácia pre Slovensko (sk-SK)**

Správne nastavenie jazyka a formátov je kľúčové pre slovenských používateľov.

*   **3.1. Nastavenie Jazyka a Smerovanie (Routing):**
    *   **Locale:** Použite štandardný kód `sk` alebo `sk-SK`.
    *   **URL Stratégia:** Najlepšou praxou je použitie sub-direktív (napr. `www.domena.sk/sk/stranka`). Ak je slovenčina jediný jazyk, môže byť aj v koreňovom adresári (`www.domena.sk/stranka`), ale použitie `/sk/` je robustnejšie pre budúce rozšírenie o ďalšie jazyky.
    *   **Next.js Internationalized Routing:** Využite vstavané možnosti Next.js alebo knižnice ako `next-intl` na správu routingu a detekciu jazyka (cez URL, cookies, alebo `Accept-Language` header).
    *   **HTML `lang` atribút:** Nastavte `lang="sk"` v `<html>` tagu (`<html lang="sk">`).

*   **3.2. Preklady Obsahu:**
    *   Všetok viditeľný text (UI prvky, obsah stránok, chybové hlášky) musí byť preložený do slovenčiny.
    *   Používajte systémy na správu prekladov (napr. JSON súbory, i18next s `next-i18next` alebo `next-intl`). `next-intl` je často odporúčaný pre App Router.
    *   Zabezpečte kvalitný preklad, ideálne rodeným hovorcom, s ohľadom na kultúrne nuansy.

*   **3.3. Formátovanie (Dátumy, Čísla, Mena):**
    *   **Dátumy:** Používajte slovenský formát (napr. `dd.MM.yyyy` - `24.05.2024`). Využite JavaScript `Intl.DateTimeFormat` API alebo knižnice ako `date-fns` s importovaným `sk` locale.
    *   **Čísla:** Používajte slovenský formát desatinnej čiarky (`,`) a medzery ako oddeľovača tisícov (napr. `1 234,56`). Využite `Intl.NumberFormat` API.
    *   **Mena:** Zobrazujte ceny v EUR (€) so správnym formátom a symbolom (napr. `11,90 €`). `Intl.NumberFormat` s `style: 'currency', currency: 'EUR'` je ideálny.

*   **3.4. `hreflang` Atribúty:**
    *   Ak máte viac jazykových verzií (alebo plánujete mať), implementujte `hreflang` tagy v `<head>` alebo v `sitemap.xml` na označenie alternatívnych verzií stránky pre rôzne jazyky a regióny. Pre slovenčinu použite `hreflang="sk"`. Nezabudnite na `hreflang="x-default"` pre predvolenú verziu.

**4. Mobile-First Implementácia**

*   **4.1. Responzívny Dizajn:**
    *   Používajte CSS frameworky (napr. Tailwind CSS) alebo vlastné CSS s media queries, Flexbox a CSS Grid na vytvorenie layoutu, ktorý sa plynule prispôsobuje rôznym veľkostiam obrazoviek.
    *   Začnite štýlovať pre najmenšie obrazovky a postupne pridávajte štýly pre väčšie (breakpointy).

*   **4.2. Dotykové Ovládanie (Touch Targets):**
    *   Tlačidlá, odkazy a iné interaktívne prvky musia mať dostatočnú veľkosť a rozostupy, aby sa dali ľahko stlačiť prstom (minimálne 44x44px až 48x48px podľa odporúčaní).
    *   Vyhnite sa interakciám závislým od `hover` efektu, ktoré na dotykových zariadeniach nefungujú spoľahlivo. Zabezpečte alternatívu pre `click` / `tap`.

*   **4.3. Výkon na Mobilných Zariadeniach:**
    *   Mobilné siete môžu byť pomalšie a zariadenia menej výkonné. Optimalizácia kódu, obrázkov a načítania zdrojov je tu ešte dôležitejšia.

*   **4.4. Testovanie:**
    *   Testujte na reálnych mobilných zariadeniach (iOS, Android) a rôznych veľkostiach obrazoviek.
    *   Používajte nástroje na emuláciu v prehliadačoch (Chrome DevTools, Firefox Responsive Design Mode).

**5. Optimalizácia a Načítanie Obrázkov**

Obrázky sú často najväčším zdrojom dát na stránke.

*   **5.1. Využitie Next.js `<Image>` Komponentu:**
    *   **Vždy** používajte komponent `<Image>` (`next/image`) namiesto štandardného `<img>` tagu.
    *   **Benefity:** Automatická optimalizácia formátu (WebP/AVIF), zmena veľkosti, lazy loading, prevencia Cumulative Layout Shift (CLS) vďaka povinným `width` a `height` atribútom (alebo `fill` prop s rodičovským elementom s pozíciou).

*   **5.2. Správne Formáty:**
    *   `<Image>` komponent automaticky ponúkne moderné formáty ako **WebP** alebo **AVIF** prehliadačom, ktoré ich podporujú, a fallback na JPEG/PNG pre staršie. Tieto formáty ponúkajú lepšiu kompresiu pri zachovaní kvality.

*   **5.3. Responzívne Obrázky (`sizes` prop):**
    *   Použite `sizes` prop na informovanie prehliadača, akú veľkosť bude mať obrázok pri rôznych šírkach viewportu. Umožňuje to načítať optimálne veľký súbor a šetriť dáta. Príklad: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`.

*   **5.4. Lazy Loading:**
    *   `<Image>` komponent automaticky aplikuje `loading="lazy"` pre obrázky, ktoré nie sú viditeľné v počiatočnom viewporte (above the fold). Tým sa odkladá ich načítanie, kým nie sú potrebné, a zrýchľuje sa počiatočné načítanie stránky. Pre obrázky "above the fold" (napr. hlavný banner) môžete pridať `priority={true}`.

*   **5.5. Placeholders (Blur, Base64):**
    *   Použite `placeholder="blur"` alebo `placeholder="empty"` s `blurDataURL` (malý Base64 obrázok) na zobrazenie rozmazanej alebo farebnej verzie obrázka počas jeho načítavania. Zlepšuje to vnímanú rýchlosť a znižuje CLS.

*   **5.6. CDN (Content Delivery Network):**
    *   Platformy ako Vercel alebo Netlify automaticky servujú optimalizované obrázky cez globálnu CDN, čo znižuje latenciu pre používateľov kdekoľvek na svete (aj na Slovensku). Ak hostujete sami, zvážte konfiguráciu externého image loadera s CDN.

**6. Rýchlosť Načítania (Performance Optimization)**

*   **6.1. Stratégie Renderovania:**
    *   **SSG (Static Site Generation):** Ideálne pre stránky, ktorých obsah sa nemení často (blogové články, informačné stránky). Najrýchlejšie načítanie. Použite `getStaticProps`.
    *   **SSR (Server-Side Rendering):** Vhodné pre stránky s dynamickým obsahom, ktorý musí byť aktuálny pri každej požiadavke a dôležitý pre SEO (napr. produktová stránka s aktuálnou cenou). Použite `getServerSideProps` (Pages Router) alebo Server Components (App Router).
    *   **ISR (Incremental Static Regeneration):** Kombinuje výhody SSG (rýchlosť) s možnosťou periodickej aktualizácie na pozadí bez nutnosti rebuildu celej stránky. Dobré pre často aktualizované, ale nie real-time dáta. Nastavuje sa cez `revalidate` v `getStaticProps`.
    *   **CSR (Client-Side Rendering):** Používajte len pre časti aplikácie, ktoré nie sú kritické pre SEO a môžu sa načítať po interakcii používateľa (napr. obsah dashboardu po prihlásení). V Next.js často kombinované s SSG/SSR pre "shell" stránky.

*   **6.2. Code Splitting:**
    *   Next.js automaticky rozdeľuje kód na úrovni stránok.
    *   Používajte dynamické importy (`next/dynamic`) pre komponenty alebo knižnice, ktoré nie sú potrebné pri počiatočnom načítaní (napr. modálne okná, grafy, špecifické interaktívne prvky).

*   **6.3. Optimalizácia JavaScript Bundle:**
    *   Analyzujte veľkosť bundle pomocou `@next/bundle-analyzer`.
    *   Identifikujte a odstráňte alebo nahraďte veľké závislosti. Používajte "tree-shaking" podporované knižnice.
    *   Minimalizujte a komprimujte JavaScript (Next.js to robí automaticky v produkčnom builde).

*   **6.4. Caching Stratégie:**
    *   Využívajte HTTP caching hlavičky (`Cache-Control`) pre statické assety (JS, CSS, obrázky, fonty). Next.js a hosting platformy to často konfigurujú automaticky.
    *   Implementujte caching dát na strane servera alebo klienta pre často žiadané dáta z API. Next.js App Router má pokročilé možnosti cachovania pre `fetch`.

*   **6.5. Optimalizácia Fontov (`next/font`):**
    *   Používajte `next/font/google` alebo `next/font/local` na optimalizáciu a self-hosting webfontov.
    *   **Benefity:** Eliminuje externé požiadavky na fonty, znižuje CLS (`layout shift`) vďaka automatickému nastaveniu `size-adjust`, umožňuje prednačítanie.

*   **6.6. Minimalizácia Third-Party Skriptov:**
    *   Každý externý skript (analytika, chat, reklamy) spomaľuje stránku. Auditujte ich potrebu a dopad na výkon (napr. cez Lighthouse).
    *   Načítavajte ich asynchrónne (`async`, `defer`) alebo po interakcii používateľa, ak je to možné. Zvážte použitie `next/script` komponentu pre lepšiu kontrolu načítania.

*   **6.7. Core Web Vitals (CWV):**
    *   Monitorujte a optimalizujte pre kľúčové metriky Google:
        *   **LCP (Largest Contentful Paint):** Rýchlosť načítania hlavného obsahu. Optimalizujte obrázky nad záhybom (prioritizujte ich), server response time, kritické CSS.
        *   **FID (First Input Delay) / INP (Interaction to Next Paint):** Rýchlosť reakcie na prvú interakciu / celková responzivita. Optimalizujte JavaScript (veľkosť, vykonávanie), minimalizujte dlhé úlohy (long tasks).
        *   **CLS (Cumulative Layout Shift):** Vizuálna stabilita. Špecifikujte rozmery obrázkov/videí, rezervujte miesto pre dynamický obsah (reklamy), načítavajte fonty optimálne (`next/font`).
    *   Používajte nástroje: Google PageSpeed Insights, Lighthouse, Chrome User Experience Report (CrUX), Google Search Console (Core Web Vitals report).

**7. Kľúčové Aspekty User Experience (UX)**

*   **7.1. Intuitívna Navigácia:**
    *   Hlavné menu musí byť jednoduché, konzistentné a ľahko pochopiteľné.
    *   Používajte "breadcrumb" navigáciu na komplexnejších stránkach.
    *   Vyhľadávanie (ak je relevantné) by malo byť ľahko dostupné a funkčné.

*   **7.2. Jasné Call-to-Actions (CTA):**
    *   Tlačidlá a odkazy, ktoré vedú k cieľovým akciám (napr. "Kúpiť", "Rezervovať degustáciu", "Kontaktujte nás"), musia byť vizuálne výrazné a textovo jednoznačné (používajte slovesá v slovenčine).

*   **7.3. Čitateľnosť a Prístupnosť (Accessibility - WCAG):**
    *   **Text:** Dostatočný kontrast medzi textom a pozadím (min. 4.5:1 pre bežný text). Zvoľte čitateľné fonty a primeranú veľkosť písma (min. 16px pre hlavný text). Správna dĺžka riadkov a riadkovanie.
    *   **Sémantický HTML:** Používajte správne HTML tagy (`<nav>`, `<main>`, `<article>`, `<aside>`, `<button>`, zoznamy atď.) pre štruktúru a význam.
    *   **Ovládanie z Klávesnice:** Všetky interaktívne prvky musia byť dostupné a ovládateľné pomocou klávesnice (tab, enter, space). Zabezpečte viditeľný `:focus` štýl.
    *   **ARIA Atribúty:** Používajte ARIA (Accessible Rich Internet Applications) atribúty tam, kde sémantika HTML nestačí (napr. pre komplexné widgety).
    *   **Alt Texty:** Ako už bolo spomenuté pri SEO, popisné `alt` texty sú kľúčové pre používateľov s čítačkami obrazovky.
    *   Dodržiavajte štandardy **WCAG 2.1 AA** ako minimum.

*   **7.4. Spätná Väzba a Chybové Stavy:**
    *   Poskytnite používateľovi vizuálnu spätnú väzbu pri akciách (napr. indikátor načítania pri odosielaní formulára, potvrdenie úspechu).
    *   Zobrazujte jasné, zrozumiteľné a nápomocné chybové hlášky (v slovenčine) priamo pri probléme (napr. validácia formulárov).

*   **7.5. Konzistentnosť:**
    *   Udržujte konzistentný vizuálny štýl (farby, typografia, ikonografia) a správanie komponentov naprieč celou aplikáciou.

**8. Nástroje a Zdroje**

*   **Výkon a SEO Analýza:**
    *   Google PageSpeed Insights
    *   Google Lighthouse (v Chrome DevTools)
    *   Google Search Console
    *   GTmetrix, WebPageTest
    *   `@next/bundle-analyzer`
*   **SEO Nástroje:**
    *   Google Keyword Planner
    *   Ahrefs, SEMrush, Moz
    *   Google Rich Results Test (pre štruktúrované dáta)
*   **Lokalizácia:**
    *   `next-intl`
    *   `next-i18next` (pre Pages Router)
    *   `date-fns` (s `sk` locale)
    *   JavaScript `Intl` API
*   **Prístupnosť:**
    *   WAVE Web Accessibility Evaluation Tool
    *   axe DevTools
    *   WCAG Dokumentácia

