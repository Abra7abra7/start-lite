# Konvencie Kódovania a Prispievania do Projektu

## 1. Úvod

Tento dokument definuje súbor konvencií pre písanie kódu, štruktúru commitov, prácu s vetvami a celkový proces prispievania do projektu e-shopu Pútec. Cieľom je zabezpečiť konzistentnosť kódu, jeho čitateľnosť, jednoduchšiu údržbu a efektívnu spoluprácu.

## 2. Formátovanie Kódu

*   **Prettier:**
    *   Používame Prettier na automatické formátovanie kódu. Tým sa zabezpečí jednotný štýl naprieč celým projektom.
    *   Konfigurácia Prettier sa nachádza v súbore `.prettierrc.json` (alebo podobnom).
    *   Odporúča sa nastaviť automatické formátovanie pri ukladaní súboru v IDE (napr. VS Code `"editor.formatOnSave": true`).
    *   Pred každým commitom by mal byť kód naformátovaný.
*   **ESLint:**
    *   Používame ESLint na statickú analýzu kódu a odhaľovanie potenciálnych chýb a problémov so štýlom, ktoré Prettier nerieši.
    *   Konfigurácia ESLint sa nachádza v súbore `.eslintrc.json` (alebo podobnom) a mala by rozširovať odporúčané pravidlá pre Next.js, TypeScript a React (napr. `eslint-config-next`).
    *   Riešte všetky chyby a varovania z ESLint pred commitom.

## 3. TypeScript Konvencie

*   **Typová bezpečnosť:** Využívajte silné typovanie TypeScriptu. Vyhýbajte sa používaniu `any` typu, pokiaľ to nie je absolútne nevyhnutné. Používajte `unknown` namiesto `any` ak je to možné a následne typ overte.
*   **Rozhrania (Interfaces) vs. Typy (Types):**
    *   Používajte `interface` pre definovanie tvaru objektov a pre implementáciu triedami.
    *   Používajte `type` pre primitívne typy, union typy, intersection typy, a komplexnejšie typové aliasy.
*   **Názvy typov:** Používajte PascalCase pre názvy typov a rozhraní (napr. `UserProfile`, `OrderDetails`).
*   **Generované typy:** Typy generované zo Supabase schémy (`types/supabase.ts`) by mali byť primárnym zdrojom pre typy dátových modelov.

## 4. Názvoslovie

*   **Premenné a funkcie:** Používajte camelCase (napr. `userName`, `calculateTotalPrice`).
*   **Konštanty:** Používajte SCREAMING_SNAKE_CASE (napr. `MAX_ITEMS_IN_CART`).
*   **Komponenty (React/Next.js):** Používajte PascalCase pre názvy komponentov (napr. `ProductCard`, `CheckoutForm`). Názvy súborov komponentov by mali byť tiež v PascalCase (napr. `ProductCard.tsx`).
*   **Súbory a priečinky:** Používajte kebab-case pre väčšinu súborov a priečinkov (napr. `send-order-emails.ts`, `auth-helpers`), s výnimkou komponentov.
*   **API Routes a Server Actions:** Názvy by mali byť deskriptívne a reflektovať akciu, ktorú vykonávajú.

## 5. Komentáre

*   Píšte komentáre tam, kde je kód zložitý alebo jeho účel nie je okamžite zrejmý.
*   Vyhýbajte sa nadbytočným komentárom, ktoré len opakujú to, čo je z kódu jasné.
*   Pre funkcie a komponenty používajte JSDoc / TSDoc komentáre na popis ich účelu, parametrov a návratových hodnôt.
    ```typescript
    /**
     * Calculates the total price of items in the cart.
     * @param items - Array of cart items.
     * @returns The total price.
     */
    const calculateTotalPrice = (items: CartItem[]): number => {
      // ... implementation
    };
    ```

## 6. Git Konvencie

*   **Vetva (Branching Strategy):**
    *   **`main` (alebo `master`):** Hlavná produkčná vetva. Obsahuje stabilný kód, ktorý je nasadený.
    *   **`develop`:** Vývojová vetva, kde sa integrujú nové funkcie. Z tejto vetvy sa vytvárajú feature vetvy.
    *   **Feature vetvy:** Pre každú novú funkciu, opravu chyby alebo úlohu sa vytvára samostatná vetva z `develop`.
        *   Názov vetvy by mal byť deskriptívny, napr. `feature/user-authentication`, `fix/cart-calculation-bug`, `chore/update-dependencies`.
        *   Používajte prefixy ako `feature/`, `fix/`, `chore/`, `docs/`.
    *   Po dokončení práce vo feature vetve sa vytvára Pull Request (PR) do `develop` vetvy.
*   **Commity:**
    *   **Conventional Commits:** Odporúča sa používať štandard Conventional Commits ([https://www.conventionalcommits.org/](https://www.conventionalcommits.org/)).
        *   Formát: `<type>[optional scope]: <description>`
        *   Príklady typov: `feat` (nová funkcia), `fix` (oprava chyby), `docs` (zmeny v dokumentácii), `style` (formátovanie), `refactor` (refaktoring kódu bez zmeny funkčnosti), `test` (pridanie alebo oprava testov), `chore` (údržba, build skripty).
        *   Príklad commit správy: `feat(auth): implement user login functionality`
    *   Píšte jasné a stručné commit správy v anglickom jazyku (alebo slovenskom, ak je to preferované tímom a konzistentné).
    *   Každý commit by mal reprezentovať malú, logickú zmenu.
*   **Pull Requests (PRs) / Merge Requests (MRs):**
    *   Pred vytvorením PR sa uistite, že kód je naformátovaný, prešiel ESLint kontrolou a všetky testy prechádzajú.
    *   V popise PR jasne uveďte, aké zmeny boli vykonané a prečo.
    *   Ak PR rieši konkrétny issue, odkážte naň (napr. `Closes #123`).
    *   PR by mal byť skontrolovaný aspoň jedným ďalším členom tímu (code review) pred zlúčením do `develop` vetvy.
    *   Po zlúčení feature vetvy do `develop` by mala byť feature vetva zmazaná.

## 7. Testovanie

*   Píšte testy pre novú funkcionalitu a opravy chýb.
*   Jednotkové testy (Unit Tests) pre izolované funkcie a komponenty.
*   Integračné testy (Integration Tests) pre interakciu medzi komponentmi/modulmi.
*   End-to-End (E2E) testy pre kľúčové používateľské scenáre.
*   Udržujte testy aktuálne so zmenami v kóde.

## 8. Dokumentácia

*   Udržujte projektovú dokumentáciu (v priečinku `/docs`) aktuálnu.
*   Dokumentujte nové funkcie, architektonické rozhodnutia a zmeny v existujúcej funkcionalite.

## 9. Správa Závislostí

*   Používajte `npm` alebo `yarn` (alebo `pnpm`) konzistentne.
*   Pravidelne aktualizujte závislosti, aby ste mali najnovšie bezpečnostné opravy a funkcie. Testujte aplikáciu po aktualizácii závislostí.
*   Odstraňujte nepoužívané závislosti.

## 10. Komunikácia v Tíme

*   Pravidelná komunikácia je kľúčová.
*   Používajte nástroje na správu úloh (napr. Jira, Trello, GitHub Issues).
*   Pri nejasnostiach alebo problémoch sa pýtajte a diskutujte.

## 11. Záver

Dodržiavanie týchto konvencií pomôže vytvoriť kvalitný, udržateľný a ľahko spravovateľný kód. Je dôležité, aby všetci členovia tímu tieto pravidlá poznali a rešpektovali. Tieto konvencie môžu byť časom upravené a vylepšené podľa potrieb projektu a tímu.
