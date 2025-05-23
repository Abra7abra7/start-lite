# Návod na Nasadenie (Deployment)

## 1. Úvod

Tento dokument popisuje proces nasadenia (deploymentu) e-shopu Pútec, ktorý je postavený na Next.js a Supabase. Zameriame sa na bežné platformy pre nasadenie Next.js aplikácií a konfiguráciu potrebných služieb.

## 2. Predpoklady

*   Projekt je verzovaný pomocou Git a hosťovaný na platforme ako GitHub, GitLab alebo Bitbucket.
*   Máte vytvorený Supabase projekt pre produkčné prostredie.
*   Máte vytvorený Stripe účet pre produkčné prostredie.
*   Všetky potrebné API kľúče a premenné prostredia sú pripravené.

## 3. Výber hostingovej platformy pre Next.js

Pre Next.js aplikácie existuje niekoľko populárnych a odporúčaných hostingových platforiem:

*   **Vercel:**
    *   Platforma od tvorcov Next.js, ponúka najlepšiu integráciu a optimalizáciu.
    *   Jednoduché nasadenie priamo z Git repozitára.
    *   Automatické buildy a nasadenia pri každom push do hlavnej vetvy (alebo iných nakonfigurovaných vetiev).
    *   Podpora pre Server Components, API Routes, Edge Functions, Middleware.
    *   Globálna CDN pre rýchle doručovanie obsahu.
    *   Možnosť nastavenia vlastnej domény a SSL certifikátov.
*   **Netlify:**
    *   Podobne ako Vercel, ponúka jednoduché nasadenie z Git repozitára.
    *   Dobrá podpora pre Next.js (aj keď niektoré pokročilé funkcie môžu vyžadovať špecifickú konfiguráciu).
    *   Funkcie ako Netlify Forms, Netlify Functions (alternatíva k API Routes/Edge Functions).
*   **AWS (Amazon Web Services):**
    *   Flexibilnejšia, ale aj komplexnejšia možnosť.
    *   Služby ako AWS Amplify, AWS S3/CloudFront (pre statické časti), AWS Lambda (pre API/SSR), AWS Fargate/ECS (pre kontajnerizované aplikácie).
    *   Vyžaduje viac manuálnej konfigurácie.
*   **Google Cloud Platform (GCP):**
    *   Služby ako Google App Engine, Cloud Run, Firebase Hosting (pre statické časti).
*   **Azure (Microsoft):**
    *   Azure App Service, Azure Static Web Apps.

**Odporúčanie pre Pútec:** Vercel je často najjednoduchšou a najefektívnejšou voľbou pre Next.js projekty vďaka svojej tesnej integrácii.

## 4. Konfigurácia Supabase pre produkciu

*   **Vytvorenie produkčného projektu:** Ak ste doteraz používali len lokálny alebo vývojový Supabase projekt, vytvorte nový projekt v Supabase dashboarde pre produkčné prostredie.
*   **Migrácie:** Aplikujte všetky databázové migrácie na produkčný Supabase projekt. Supabase CLI a dashboard ponúkajú nástroje na správu migrácií.
    ```bash
    # Lokálne, ak ste si istí, že lokálne migrácie sú finálne
    supabase db remote set <URL_PRODUKCNEJ_DB_ZO_SUPABASE_DASHBOARDU>
    supabase db push # POZOR: Toto by sa malo robiť opatrne, ideálne cez Supabase CI/CD alebo manažované migrácie
    ```
    Lepší prístup je spravovať migrácie cez Supabase GitHub integráciu alebo manuálnym spúšťaním SQL skriptov v Supabase SQL editore.
*   **RLS Politiky:** Uistite sa, že všetky Row Level Security politiky sú správne nastavené a aktívne v produkčnej databáze.
*   **Zálohovanie:** Skontrolujte a nastavte politiky zálohovania databázy v Supabase dashboarde.
*   **Vlastná doména (voliteľné):** Nakonfigurujte vlastnú doménu pre váš Supabase projekt, ak je to potrebné.

## 5. Konfigurácia Stripe pre produkciu

*   **Prepnutie na Live Mode:** V Stripe dashboarde prepnite z testovacieho režimu na živý (Live) režim.
*   **Produkčné API kľúče:** Získajte produkčné (Live) API kľúče (Publishable Key, Secret Key).
*   **Produkčný Webhook Endpoint:**
    *   Vytvorte alebo aktualizujte webhook endpoint v Stripe dashboarde tak, aby smeroval na URL vašej nasadenej Next.js aplikácie (napr. `https://vasadomena.sk/api/webhooks/stripe`).
    *   Použite produkčný Webhook Signing Secret.

## 6. Proces nasadenia (príklad s Vercel)

1.  **Pripojenie Git repozitára:**
    *   Vytvorte si účet na Vercel a pripojte svoj Git repozitár (napr. GitHub).
    *   Vyberte projekt, ktorý chcete nasadiť.
2.  **Konfigurácia projektu na Vercel:**
    *   **Framework Preset:** Vercel by mal automaticky detekovať Next.js.
    *   **Build & Output Settings:** Štandardné nastavenia pre Next.js by mali fungovať (`next build` ako build command, `.next` ako output directory).
    *   **Premenné prostredia:**
        *   V nastaveniach projektu na Vercel zadajte všetky potrebné premenné prostredia. Tieto by mali byť produkčné verzie kľúčov a konfigurácií:
            *   `NEXT_PUBLIC_SUPABASE_URL` (URL vášho produkčného Supabase projektu)
            *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon kľúč vášho produkčného Supabase projektu)
            *   `SUPABASE_SERVICE_ROLE_KEY` (Ak ho používate na serveri - zaobchádzajte s ním extrémne opatrne)
            *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Produkčný verejný kľúč Stripe)
            *   `STRIPE_SECRET_KEY` (Produkčný tajný kľúč Stripe)
            *   `STRIPE_WEBHOOK_SECRET` (Produkčný webhook secret Stripe)
            *   Akékoľvek ďalšie premenné (napr. pre emailové služby, analytiku, atď.).
3.  **Spustenie nasadenia:**
    *   Vercel automaticky spustí build a nasadenie pri prvom importe projektu a následne pri každom push do nakonfigurovanej vetvy (typicky `main` alebo `master`).
    *   Môžete sledovať priebeh buildu a nasadenia v Vercel dashboarde.
4.  **Vlastná doména:**
    *   Po úspešnom nasadení vám Vercel pridelí subdoménu (napr. `putec.vercel.app`).
    *   V nastaveniach projektu na Vercel môžete pridať a nakonfigurovať vlastnú doménu (napr. `www.putec.sk`). To zvyčajne zahŕňa úpravu DNS záznamov u vášho registrátora domén.
    *   Vercel automaticky zabezpečí SSL certifikát pre vašu doménu.

## 7. Post-Deployment Kroky

*   **Dôkladné testovanie:**
    *   Prejdite všetky kľúčové funkcionality e-shopu v produkčnom prostredí (registrácia, prihlásenie, prezeranie produktov, pridanie do košíka, proces objednávky, platba pomocou testovacích kariet v live režime Stripe, ak je to možné, alebo malá reálna transakcia).
    *   Overte funkčnosť administrátorskej sekcie.
    *   Skontrolujte, či správne fungujú emaily (potvrdenie objednávky, atď.).
*   **Monitoring a Logovanie:**
    *   Vercel poskytuje logy pre buildy a runtime (Serverless Functions, Edge Functions).
    *   Supabase poskytuje logy pre databázu a API.
    *   Zvážte integráciu externej služby pre monitoring a logovanie (napr. Sentry, Logtail, Datadog) pre lepšiu diagnostiku problémov.
*   **Analytika:**
    *   Nasaďte nástroje pre webovú analytiku (napr. Google Analytics, Plausible Analytics, Vercel Analytics).
*   **SEO:**
    *   Overte, či je `robots.txt` správne nakonfigurovaný.
    *   Odošlite sitemap.xml do Google Search Console a iných vyhľadávačov.

## 8. Aktualizácie a údržba

*   **Kontinuálne nasadzovanie (CI/CD):** Vercel (a podobné platformy) automaticky nasadzujú zmeny z vašej hlavnej Git vetvy.
*   **Staging/Preview prostredia:** Vercel automaticky vytvára preview nasadenia pre každú pull request, čo umožňuje testovať zmeny pred ich zlúčením do produkčnej vetvy.
*   **Pravidelné zálohovanie Supabase:** Aj keď Supabase robí automatické zálohy, skontrolujte ich frekvenciu a retenčnú politiku.
*   **Aktualizácia závislostí:** Pravidelne aktualizujte Next.js, Supabase knižnice a ostatné závislosti projektu, aby ste mali najnovšie funkcie a bezpečnostné opravy.

## 9. Záver

Nasadenie moderných webových aplikácií je vďaka platformám ako Vercel a Supabase relatívne priamočiare. Kľúčom k úspešnému nasadeniu je dôkladná príprava premenných prostredia, správna konfigurácia externých služieb (Supabase, Stripe) pre produkčné prostredie a následné dôkladné testovanie.
