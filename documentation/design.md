Jasné, pripravil som podrobnú dokumentáciu v štýle Markdown, ktorá vysvetľuje brand identitu a štýlovú príručku pre implementáciu s Tailwind CSS, Shadcn/ui, Framer Motion a NextUI. Zameriava sa na vysvetlenie konceptov a použitia, nie len na samotný kód.

# Dokumentácia: Brand & Style Guide - Rodinné vinárstvo Pútec

**Verzia:** 1.0
**Dátum:** 24. 5. 2024

## Úvod

Tento dokument definuje vizuálnu identitu značky "Rodinné vinárstvo Pútec" a poskytuje technickú štýlovú príručku pre jej konzistentnú implementáciu v rámci webových aplikácií postavených na Next.js s využitím Tailwind CSS, Shadcn/ui, Framer Motion a voliteľne NextUI. Cieľom je zabezpečiť jednotný vzhľad, dojem a užívateľský zážitok naprieč celým digitálnym prostredím značky.

## Časť 1: Identita Značky (Brand Identity)

### 1.1 Názov Značky

**Rodinné vinárstvo Pútec**

### 1.2 Osobnosť Značky (Archetyp)

Značka komunikuje kombináciou nasledujúcich archetypov:

*   **Tradičný opatrovateľ:** Zdôrazňuje rodinné korene, dedičstvo, starostlivosť, kvalitu a zodpovednosť voči vinohradu a produktu.
*   **Elegantný hostiteľ:** Vytvára príjemnú atmosféru, víta hostí, ponúka kvalitné zážitky (degustácie, ubytovanie), dbá na detaily a pohostinnosť.
*   **Zemitý remeselník:** Odkazuje na spojenie s prírodou (Malokarpatská oblasť), autenticitu, poctivú prácu a vášeň pre vinárstvo.

### 1.3 Kľúčové Posolstvo (Príklady)

*   "Ochutnajte tradíciu a pohostinnosť Malých Karpát v každom dúšku."
*   "Rodinné vinárstvo Pútec: Kde sa dedičstvo stretáva s chuťou."
*   "Poctivé víno s dušou rodiny a regiónu."

### 1.4 Farebná Paleta

Farby sú kľúčové pre vizuálnu komunikáciu značky. Paleta je navrhnutá tak, aby bola teplá, elegantná a spojená s prírodou a vínom.

*   **Primárna (Primary):**
    *   Kód: `#DEB584` (R:222, G:181, B:132)
    *   Popis: Teplá, stredne svetlá béžová. Evokuje slnko, zrelé biele hrozno, pieskovec, drevo sudov, eleganciu. Používa sa ako hlavná farba značky pre dôležité prvky, tlačidlá, pozadia.
    *   Tailwind Názov: `primary`, `brand-primary`
*   **Akcentová (Accent):**
    *   Kód: `#800020` (cca R:128, G:0, B:32)
    *   Popis: Hlboká, sýta vínovo červená. Symbolizuje červené víno, vášeň, tradíciu, zrelosť. Používa sa na zvýraznenie kľúčových akcií (CTA tlačidlá), dôležitých nadpisov alebo dekoratívnych prvkov.
    *   Tailwind Názov: `accent`, `brand-accent`
*   **Svetlá Neutrálna (Light / Background):**
    *   Kód: `#F8F4E3` (cca R:248, G:244, B:227)
    *   Popis: Veľmi svetlá krémová / "off-white". Slúži ako hlavná farba pozadia stránok pre čistý a vzdušný vzhľad. Pripomína starý papier alebo svetlú omietku.
    *   Tailwind Názov: `background`, `brand-light`
*   **Tmavá Neutrálna (Dark / Foreground):**
    *   Kód: `#363432` (cca R:54, G:52, B:50)
    *   Popis: Tmavosivá s hnedastým nádychom ("uhľová"). Používa sa primárne pre hlavný text, aby zabezpečila dobrú čitateľnosť a pôsobila jemnejšie ako čisto čierna.
    *   Tailwind Názov: `foreground`, `brand-dark`
*   **Zvýrazňujúca (Highlight):**
    *   Kód: `#B08D57` (cca R:176, G:141, B:87)
    *   Popis: Zlatistý okr, tmavší a menej saturovaný odtieň primárnej. Používa sa na jemné zvýraznenia, ikony, linky alebo ako súčasť gradientov na dodanie hĺbky a prémiového nádychu.
    *   Tailwind Názov: `highlight`, `brand-highlight`

### 1.5 Typografia

Výber fontov podporuje osobnosť značky – kombinácia tradície a modernej čitateľnosti.

*   **Hlavné Nadpisy (Headings):**
    *   **Font:** Cormorant Garamond (alebo alternatíva: Playfair Display, Merriweather)
    *   **Štýl:** Serif (pätkové písmo)
    *   **Charakteristika:** Elegantný, klasický, s vysokým kontrastom, vhodný pre nadpisy a krátke texty vyžadujúce dôraz a tradičný vzhľad.
    *   **Tailwind Class:** `font-serif`
*   **Telo Textu (Body):**
    *   **Font:** Inter (alebo alternatíva: Lato, Open Sans, Montserrat)
    *   **Štýl:** Sans-serif (bezpätkové písmo)
    *   **Charakteristika:** Moderný, čistý, vysoko čitateľný v rôznych veľkostiach a na rôznych zariadeniach. Ideálny pre odstavce, popisy, UI prvky.
    *   **Tailwind Class:** `font-sans` (nastavený ako predvolený pre `body`)

### 1.6 Použitie Gradientov

Gradienty (farebné prechody) sa používajú striedmo na dodanie hĺbky a vizuálnej zaujímavosti.

*   **Štýl:** Preferujú sa jemné, subtílne prechody.
*   **Smer:** Najčastejšie vertikálne (`to bottom`) alebo jemne diagonálne (`to bottom right`).
*   **Farebné Kombinácie:**
    *   Medzi odtieňmi jednej farby (napr. `primary` do svetlejšej `primary`).
    *   Medzi `primary` a `highlight`.
    *   Výraznejšie (pre CTA): `primary` do `accent` alebo `primary` do `highlight`.
*   **Použitie:** Pozadia sekcií, karty, CTA tlačidlá, bannery.

## Časť 2: Štýlová Príručka Implementácie

Táto časť popisuje, ako aplikovať definovanú brand identitu pomocou špecifických technológií.

### 2.1 Základné Nastavenie (Tailwind CSS & Globálne Štýly)

#### 2.1.1 Konfigurácia Tailwind (`tailwind.config.js`)

*   **Farby:**
    *   Definujte vlastnú paletu v sekcii `theme.extend.colors`.
    *   Použite sémantické názvy (`primary`, `accent`, `background`, `foreground`, `highlight`).
    *   Namapujte tieto farby na CSS premenné používané knižnicou Shadcn/ui (napr. `--primary`, `--accent`, `--background`) pre automatické prefarbenie komponentov. HSL formát je preferovaný pre Shadcn.
    *   Pridajte aj priame mapovanie na vaše `brand-*` názvy pre flexibilitu.
*   **Fonty:**
    *   V sekcii `theme.extend.fontFamily` prepojte logické názvy (`sans`, `serif`) s CSS premennými (`var(--font-sans)`, `var(--font-serif)`), ktoré budú nastavené cez `next/font`.
*   **Zaoblenie (Border Radius):**
    *   Synchronizujte hodnoty `borderRadius` s CSS premennou `--radius` používanou Shadcn/ui pre konzistentné zaoblenie komponentov.
*   **Animácie a Keyframes:**
    *   Pridajte základné animácie pre Shadcn komponenty (napr. `accordion-down`, `accordion-up`).
    *   Môžete sem pridať aj vlastné `keyframes` a `animation` triedy pre opakované animácie.
*   **Gradienty:**
    *   Definujte často používané gradienty v `theme.extend.backgroundImage` pre jednoduchšie použitie (napr. `gradient-primary-accent`).
*   **Pluginy:**
    *   Nezabudnite zahrnúť `tailwindcss-animate` (požadovaný pre Shadcn/ui).
    *   Ak používate NextUI, pridajte aj jeho plugin (`@nextui-org/react`).

#### 2.1.2 Globálne Štýly (`app/globals.css`)

*   **Import Tailwind:** Začnite s direktívami `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`.
*   **CSS Premenné (`@layer base`):**
    *   V bloku `:root` definujte CSS premenné pre farby (`--background`, `--foreground`, `--primary`, `--accent`, atď.) v HSL formáte, ktoré používa Shadcn/ui. Namapujte ich na hodnoty z vašej palety.
    *   Definujte premennú `--radius` pre globálne zaoblenie.
    *   Ak plánujete tmavý režim, definujte zodpovedajúce premenné v bloku `.dark { ... }`.
*   **Základné Štýly (`@layer base`):**
    *   Nastavte predvolené `background-color` a `color` pre `body` pomocou `--background` a `--foreground`.
    *   Nastavte predvolený `font-family` na `var(--font-sans)`.
    *   Nastavte základné štýly pre nadpisy (H1-H6), napr. pomocou `@apply font-serif font-bold;`.
*   **Utility Triedy (`@layer components`):**
    *   Voliteľne môžete definovať vlastné komplexnejšie utility triedy pomocou `@apply` (napr. `.btn-primary-gradient`) pre často opakované kombinácie štýlov.

### 2.2 Nastavenie Fontov (`next/font`)

*   **Implementácia:** V hlavnom layoute aplikácie (`app/layout.tsx`) použite `next/font/google` alebo `next/font/local` na importovanie a konfiguráciu vašich fontov (Inter a Cormorant Garamond).
*   **Konfigurácia:**
    *   Nastavte správne `subsets` (vrátane `latin-ext` pre slovenské znaky).
    *   Priraďte CSS premenné (`variable: '--font-sans'`, `variable: '--font-serif'`).
    *   Pridajte tieto premenné do `className` na `<html>` tagu.
*   **Výhody:** Optimalizované načítanie fontov, self-hosting, prevencia CLS (Layout Shift).

### 2.3 Štýlovanie Komponentov (Shadcn/ui)

*   **Základný Princíp:** Shadcn/ui komponenty sú **neštýlované** v zmysle vlastných tried, ale využívajú Tailwind utility a CSS premenné definované v `globals.css`. Vzhľad sa teda primárne riadi vašou Tailwind konfiguráciou a globálnymi premennými.
*   **Farby a Vzhľad:** Komponenty automaticky preberú farby (`primary`, `accent`, `background`, atď.) a zaoblenie (`--radius`) z vašich CSS premenných.
*   **Varianty:** Väčšina Shadcn komponentov ponúka `variant` prop (napr. `<Button variant="outline">`). Tieto varianty využívajú preddefinované kombinácie CSS premenných (napr. `outline` použije `--border` a text vo farbe `--primary`).
*   **Prispôsobenie:**
    *   **Jednoduché Úpravy:** Pre špecifické úpravy konkrétnej inštancie komponentu použite štandardné Tailwind triedy v `className` prop (napr. `<Button className="bg-accent text-accent-foreground hover:bg-accent/90">`).
    *   **Globálne Zmeny Variantu:** Ak chcete zmeniť vzhľad *všetkých* komponentov s určitým variantom, upravte zodpovedajúce štýly v `globals.css` (môže byť zložitejšie, vyžaduje nájdenie správnych selektorov alebo úpravu základných štýlov Tailwindu).
    *   **Vlastné Komponenty:** Vždy môžete "ejectnúť" kód Shadcn komponentu a upraviť si ho podľa potreby, alebo si vytvoriť vlastné komponenty s vašimi preferovanými štýlmi a variantmi.

*   **Príklad (Tlačidlo):**
    *   `<Button>` (predvolené): Použije `--primary` pre pozadie a `--primary-foreground` pre text.
    *   `<Button variant="secondary">`: Použije `--secondary` a `--secondary-foreground`.
    *   `<Button variant="outline">`: Použije priehľadné pozadie, `--border` pre okraj a `--primary` pre text.
    *   `<Button className="bg-gradient-primary-accent ...">`: Vlastné tlačidlo s gradientom pomocou Tailwind tried.

### 2.4 Aplikácia Gradientov

*   **Použitie Definovaných Tried:** Ak ste gradienty definovali v `tailwind.config.js` (napr. `gradient-primary-accent`), použite ich ako bežnú Tailwind triedu: `className="bg-gradient-primary-accent"`.
*   **Použitie Inline Tailwind Tried:** Pre jednorazové alebo špecifické gradienty použite priamo Tailwind utility: `className="bg-gradient-to-br from-primary to-highlight"`.

### 2.5 Animácie (Framer Motion)

*   **Účel:** Framer Motion sa používa na pridanie jemných, účelných animácií pre zlepšenie užívateľského zážitku (UX). Nemá priamy vplyv na základný statický štýl, ale oživuje interakcie a prechody.
*   **Implementácia:**
    *   Obaľte elementy alebo komponenty, ktoré chcete animovať, do `motion` komponentu (napr. `motion.div`, `motion.button`).
    *   Použite props ako `initial`, `animate`, `exit`, `whileHover`, `whileTap` na definovanie animácie.
    *   Animujte vlastnosti ako `opacity`, `y`, `x`, `scale`.
*   **Princípy:**
    *   **Subtílnosť:** Menej je viac. Preferujte rýchle a jemné prechody.
    *   **Účelnosť:** Animácie by mali poskytovať spätnú väzbu, viesť oko používateľa alebo spríjemniť čakanie/prechod.
    *   **Výkon:** Dávajte pozor na animovanie príliš veľa prvkov naraz, najmä na slabších zariadeniach.
*   **Príklady Použitia:**
    *   Jemný fade-in a slide-up efekt pri načítaní obsahu stránky.
    *   Zväčšenie tlačidla pri prejdení myšou (`whileHover`).
    *   Indikácia aktívneho stavu alebo načítania.
    *   Animované prechody medzi stránkami (pomocou `AnimatePresence`).

### 2.6 Integrácia s NextUI (Voliteľné)

Ak sa rozhodnete použiť NextUI (namiesto alebo popri Shadcn/ui):

*   **Konfigurácia:** NextUI vyžaduje vlastný Tailwind plugin a má svoj systém tém, ktorý sa konfiguruje v `tailwind.config.js` v rámci `nextui({...})` funkcie.
*   **Theming:** Budete musieť namapovať vašu farebnú paletu (`primary`, `secondary`, `accent`, atď.) a prípadne typografiu a zaoblenie *špecificky* pre NextUI v jeho konfiguračnom objekte. NextUI používa sémantické názvy, ktoré sa môžu líšiť od Shadcn (napr. `danger` namiesto `destructive`).
*   **Použitie:** Komponenty importované z `@nextui-org/react` budú štylizované podľa NextUI témy definovanej v Tailwind konfigurácii.
*   **Potenciálne Konflikty:** Ak miešate Shadcn/ui a NextUI, dávajte pozor na možné konflikty v názvoch CSS premenných alebo globálnych štýloch. Odporúča sa vybrať si jednu knižnicu ako primárnu pre väčšinu UI komponentov, aby sa zachovala konzistentnosť a predišlo sa problémom.

## 3. Záverečné Odporúčania a Best Practices

*   **Konzistentnosť:** Dôsledne dodržiavajte definovanú paletu, typografiu, rozostupy a štýly komponentov naprieč celou aplikáciou.
*   **Prístupnosť (Accessibility):** Vždy dbajte na dostatočný farebný kontrast (používajte online nástroje na kontrolu), sémantické HTML, možnosť ovládania klávesnicou a viditeľné focus stavy.
*   **Responzivita:** Všetky štýly musia byť plne responzívne. Testujte na rôznych veľkostiach obrazoviek. Využívajte Tailwind breakpoint prefixy (`sm:`, `md:`, `lg:`).
*   **Mobile-First:** Pri písaní štýlov zvažujte najprv mobilné zobrazenie a potom pridávajte úpravy pre väčšie obrazovky.
*   **Údržba:** Udržujte `tailwind.config.js` a `globals.css` čisté a organizované. Komentujte komplexnejšie časti.
*   **Dokumentácia Komponentov:** Ak vytvárate vlastné opakovane použiteľné komponenty, zvážte ich zdokumentovanie (napr. pomocou Storybooku) pre jednoduchšie použitie v tíme.
