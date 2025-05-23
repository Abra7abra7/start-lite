# Schéma Databázy a Row Level Security (RLS)

## 1. Úvod

Tento dokument popisuje návrh schémy databázy PostgreSQL v Supabase pre e-shop Pútec a princípy použitia Row Level Security (RLS) na zabezpečenie dát. Presná schéma sa môže vyvíjať, ale tu sú uvedené kľúčové tabuľky a ich vzťahy.

## 2. Kľúčové Tabuľky

Nasledujúce tabuľky sú základom pre fungovanie e-shopu. Všetky tabuľky by mali obsahovať štandardné stĺpce ako `id` (primárny kľúč, typicky `uuid` alebo `bigserial`), `created_at` (timestamp) a `updated_at` (timestamp).

*   **`users` (spravovaná Supabase Auth)**
    *   Obsahuje informácie o používateľoch (ID, email, atď.).
    *   Supabase Auth automaticky vytvára a spravuje túto tabuľku v schéme `auth`.
    *   Môžeme vytvoriť tabuľku `profiles` v schéme `public`, ktorá má 1:1 vzťah s `auth.users` a obsahuje dodatočné verejné alebo aplikačne špecifické informácie o používateľovi (napr. meno, priezvisko, doručovacia adresa, rola).
        *   `id` (UUID, foreign key na `auth.users.id`)
        *   `first_name` (text)
        *   `last_name` (text)
        *   `phone_number` (text, voliteľné)
        *   `role` (text, napr. 'customer', 'admin', default 'customer')

*   **`products`**
    *   `id` (UUID)
    *   `name` (text, not null)
    *   `description` (text)
    *   `price` (numeric, not null) - Cena za jednotku.
    *   `sku` (text, unique, not null) - Stock Keeping Unit.
    *   `category_id` (UUID, foreign key na `categories.id`, voliteľné)
    *   `image_url` (text) - URL hlavného obrázku produktu.
    *   `slug` (text, unique, not null) - Pre SEO-friendly URL.
    *   `is_active` (boolean, default true) - Či je produkt viditeľný a na predaj.
    *   `meta_title` (text, voliteľné)
    *   `meta_description` (text, voliteľné)

*   **`categories`**
    *   `id` (UUID)
    *   `name` (text, not null, unique)
    *   `slug` (text, unique, not null)
    *   `description` (text, voliteľné)
    *   `parent_category_id` (UUID, foreign key na `categories.id`, voliteľné) - Pre hierarchické kategórie.

*   **`inventory`** (Skladové zásoby)
    *   `id` (UUID)
    *   `product_id` (UUID, foreign key na `products.id`, not null, unique) - Predpokladáme jeden skladový záznam per produkt, ak nemáme viac skladov.
    *   `quantity` (integer, not null, default 0) - Aktuálne množstvo na sklade.
    *   `low_stock_threshold` (integer, default 0) - Hranica pre upozornenie na nízky stav zásob.
    *   Príklad použitia v `app/admin/_actions/warehouseActions.ts`.

*   **`orders`**
    *   `id` (UUID)
    *   `user_id` (UUID, foreign key na `auth.users.id`, not null)
    *   `status` (text, not null, napr. 'pending', 'paid', 'shipped', 'delivered', 'cancelled', default 'pending')
    *   `total_amount` (numeric, not null) - Celková suma objednávky.
    *   `currency` (text, not null, default 'EUR')
    *   `shipping_address_id` (UUID, foreign key na `addresses.id`)
    *   `billing_address_id` (UUID, foreign key na `addresses.id`)
    *   `stripe_payment_intent_id` (text, unique) - ID platby zo Stripe.
    *   `order_notes` (text, voliteľné) - Poznámky od zákazníka.

*   **`order_items`** (Položky objednávky)
    *   `id` (UUID)
    *   `order_id` (UUID, foreign key na `orders.id`, not null)
    *   `product_id` (UUID, foreign key na `products.id`, not null)
    *   `quantity` (integer, not null)
    *   `price_at_purchase` (numeric, not null) - Cena produktu v čase nákupu (pre historické dáta).
    *   `product_name_at_purchase` (text) - Názov produktu v čase nákupu.

*   **`addresses`** (Adresy používateľov)
    *   `id` (UUID)
    *   `user_id` (UUID, foreign key na `auth.users.id`, not null)
    *   `type` (text, napr. 'shipping', 'billing')
    *   `street` (text, not null)
    *   `city` (text, not null)
    *   `postal_code` (text, not null)
    *   `country` (text, not null)
    *   `is_default_shipping` (boolean, default false)
    *   `is_default_billing` (boolean, default false)

*   **`cart`** (Nákupný košík - alternatíva: ukladať v `localStorage` alebo `sessionStorage` a synchronizovať)
    *   Ak je v DB:
        *   `id` (UUID)
        *   `user_id` (UUID, foreign key na `auth.users.id`, unique, ak má každý user len jeden košík)
        *   `session_id` (text, pre neregistrovaných používateľov, ak podporované)

*   **`cart_items`**
    *   `id` (UUID)
    *   `cart_id` (UUID, foreign key na `cart.id`)
    *   `product_id` (UUID, foreign key na `products.id`)
    *   `quantity` (integer)

## 3. Row Level Security (RLS)

RLS je kľúčové pre zabezpečenie dát v multi-tenant aplikácii ako je e-shop. Politiky sa definujú pre každú tabuľku a pre každú operáciu (SELECT, INSERT, UPDATE, DELETE).

**Základné princípy:**

*   **Predvolene zamietnuť:** Ak nie je explicitne povolená žiadna politika, prístup je zamietnutý.
*   **Použitie `auth.uid()`:** Funkcia `auth.uid()` vracia ID aktuálne prihláseného používateľa a je základom pre väčšinu RLS politík.
*   **Použitie `auth.role()`:** Funkcia `auth.role()` vracia rolu aktuálne prihláseného používateľa (ak je definovaná, napr. 'authenticated', 'anon', alebo vlastné role).
*   **Rozdelenie politík pre rôzne role:** Často sa definujú samostatné politiky pre administrátorov a bežných používateľov.

**Príklady RLS politík:**

*   **Tabuľka `profiles`:**
    *   `SELECT`: Používateľ môže čítať svoj vlastný profil. Administrátor môže čítať všetky profily.
      ```sql
      -- Pre používateľov, aby videli svoj profil
      CREATE POLICY "Users can view their own profile." ON public.profiles
      FOR SELECT USING (auth.uid() = id);
      -- Pre adminov, aby videli všetky profily (vyžaduje stĺpec 'role' v profiles)
      CREATE POLICY "Admins can view all profiles." ON public.profiles
      FOR SELECT TO authenticated USING (get_my_claim('user_role') = 'admin'); -- get_my_claim je vlastná funkcia na získanie role z JWT
      ```
    *   `UPDATE`: Používateľ môže aktualizovať svoj vlastný profil.
      ```sql
      CREATE POLICY "Users can update their own profile." ON public.profiles
      FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
      ```
*   **Tabuľka `products`:**
    *   `SELECT`: Všetci (aj anonymní používatelia) môžu čítať aktívne produkty.
      ```sql
      CREATE POLICY "Anyone can view active products." ON public.products
      FOR SELECT USING (is_active = TRUE);
      ```
    *   `INSERT`, `UPDATE`, `DELETE`: Len administrátori.
      ```sql
      CREATE POLICY "Admins can manage products." ON public.products
      FOR ALL TO authenticated USING (get_my_claim('user_role') = 'admin') WITH CHECK (get_my_claim('user_role') = 'admin');
      ```
*   **Tabuľka `orders`:**
    *   `SELECT`: Používateľ môže čítať svoje vlastné objednávky. Administrátor môže čítať všetky objednávky.
      ```sql
      CREATE POLICY "Users can view their own orders." ON public.orders
      FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "Admins can view all orders." ON public.orders
      FOR SELECT TO authenticated USING (get_my_claim('user_role') = 'admin');
      ```
    *   `INSERT`: Prihlásený používateľ môže vytvoriť objednávku pre seba.
      ```sql
      CREATE POLICY "Authenticated users can create orders for themselves." ON public.orders
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
      ```
    *   `UPDATE`: Len administrátor môže meniť stav objednávky (napr. 'shipped'). Používateľ môže zrušiť objednávku za určitých podmienok.
*   **Tabuľka `order_items`:**
    *   Podobné politiky ako pre `orders`, často naviazané na vlastníctvo súvisiacej objednávky.

**Implementácia vlastných rolí (napr. 'admin'):**
1.  Pridajte stĺpec `role` do tabuľky `profiles` (napr. `role TEXT DEFAULT 'customer'`).
2.  Vytvorte si vlastnú JWT claim pre rolu (napr. `user_role`) pri prihlásení alebo registrácii používateľa pomocou Supabase Auth Hooks alebo databázových triggerov.
3.  Vytvorte si v databáze pomocnú funkciu `get_my_claim(claim_name TEXT)` na získanie hodnoty claimu z JWT:
    ```sql
    CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT) RETURNS TEXT AS $$
    BEGIN
      RETURN current_setting('request.jwt.claims', true)::jsonb ->> claim;
    END;
    $$ LANGUAGE plpgsql STABLE;
    ```
4.  Používajte `get_my_claim('user_role') = 'admin'` vo vašich RLS politikách.

## 4. Generovanie typov

Po definovaní alebo úprave schémy databázy je dôležité regenerovať TypeScript typy pre Supabase, aby sa zabezpečila typová bezpečnosť v kóde:

```bash
supabase gen types typescript --project-id <VASE_ID_PROJEKTU> --schema public > types/supabase.ts
```

Súbor `types/supabase.ts` by mal byť commitovaný do repozitára.

## 5. Migrácie

Akékoľvek zmeny v schéme databázy by mali byť spravované pomocou Supabase migrácií. Toto zabezpečuje konzistentnosť databázy naprieč rôznymi prostrediami (lokálne, staging, produkcia).

*   `supabase migrations new <nazov_migracie>` - Vytvorenie nového migračného súboru.
*   Upravte vygenerovaný SQL súbor s DDL príkazmi.
*   `supabase db push` (pre lokálny vývoj) alebo nasadenie cez Supabase dashboard/CLI pre produkciu.

## 6. Záver

Dobre navrhnutá schéma databázy a prísne RLS politiky sú základom bezpečného a efektívneho backendu. Je dôležité pravidelne revidovať a aktualizovať schému a politiky podľa vývoja aplikácie.
