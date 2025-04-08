'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Warehouse, WarehouseDetail, InventoryItemWithProduct } from '@/lib/types';

// Typ pre zjednodušený sklad pre select
export type WarehouseSelectItem = {
  id: number;
  name: string;
};

// Typ pre položku v zozname skladov (pre prehľad)
export type WarehouseListItem = {
  id: number;
  name: string;
  location: string | null; // Alebo string, ak je pole povinné
  created_at: string;
};

// Typ pre dáta vrátené pre jeden sklad
interface WarehouseData {
  id: number;
  name: string;
  location: string | null;
  created_at: string; // Prípadne iné potrebné polia
}

// Typ pre dáta z formulára pre vytvorenie skladu
interface CreateWarehouseData {
  name: string;
  location?: string | null; // Nepovinné
}

export async function getWarehouses(): Promise<{ data: Warehouse[] | null; error: string | null }> {
  const supabase = createClient();

  // Overenie, či je používateľ prihlásený a či má rolu admina (príklad)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    // Logovanie chyby session, ale skúsme pokračovať, ak chceme zobraziť stránku aj neprihláseným?
    // Alebo striktne vrátiť chybu:
    console.error('Session error:', sessionError);
    return { data: null, error: 'Chyba pri overovaní session.' };
  }

  if (!session) {
    return { data: null, error: 'Používateľ nie je prihlásený.' };
  }

  // Tu by mala byť kontrola role používateľa, napr.
  // const { data: userRole, error: roleError } = await supabase.rpc('get_user_role');
  // if (roleError || userRole !== 'admin') {
  //   return { data: null, error: 'Neoprávnený prístup.' };
  // }
  // Pre jednoduchosť teraz kontrolu role vynecháme, ale v produkcii je NUTNÁ!

  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching warehouses:', error);
    return { data: null, error: 'Nepodarilo sa načítať sklady.' };
  }

  return { data, error: null };
}

/**
 * Získa zoznam všetkých skladov pre prehľadovú stránku.
 */
export async function getWarehousesOverview(): Promise<{ data: WarehouseListItem[] | null; error: string | null }> {
  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Authentication error in getWarehouses:', sessionError);
    return { data: null, error: 'Chyba autentifikácie.' };
  }

  // TODO: Kontrola role (napr. len admin/manager môže vidieť všetky sklady)

  // Získanie dát
  const { data, error } = await supabase
    .from('warehouses')
    .select('id, name, location, created_at')
    .order('created_at', { ascending: false }); // Alebo podľa 'name'

  if (error) {
    console.error('Error fetching warehouses:', error);
    return { data: null, error: 'Nepodarilo sa načítať zoznam skladov.' };
  }

  return { data, error: null };
}

// Nová funkcia na načítanie detailov skladu a inventára
export async function getWarehouseDetails(warehouseId: number): Promise<{ data: WarehouseDetail | null; error: string | null }> {
  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
    return { data: null, error: 'Chyba pri overovaní session.' };
  }

  if (!session) {
    return { data: null, error: 'Používateľ nie je prihlásený.' };
  }

  // TODO: Kontrola admin role

  // Načítanie skladu a jeho inventára s detailmi produktov
  // Používame join: warehouses -> inventory -> products
  const { data, error } = await supabase
    .from('warehouses')
    .select(`
      *,
      inventory (
        *,
        products ( id, name, category, image_url )
      )
    `)
    .eq('id', warehouseId)
    .single(); // Očakávame práve jeden sklad

  if (error) {
    console.error(`Error fetching warehouse details for ID ${warehouseId}:`, error);
    if (error.code === 'PGRST116') { // Kód pre "Resource not found"
        return { data: null, error: 'Sklad s daným ID nebol nájdený.' };
    }
    return { data: null, error: 'Nepodarilo sa načítať detail skladu.' };
  }

  // Supabase vráti 'inventory' ako pole, aj keď je null v DB, preto kontrola
  // a priradenie typov
  const warehouseDetail: WarehouseDetail = {
    ...data,
    // Oprava: Jednoduchšie mapovanie, lebo názov 'products' už sedí
    inventory: (data.inventory || []) as InventoryItemWithProduct[] 
  };

  return { data: warehouseDetail, error: null };
}

// Typ pre dáta vrátené pre jeden sklad
interface WarehouseData {
  id: number;
  name: string;
  location: string | null;
  created_at: string; // Prípadne iné potrebné polia
}

/**
 * Načíta údaje jedného skladu podľa jeho ID.
 * @param warehouseId ID skladu
 */
export async function getWarehouseById(
  warehouseId: number
): Promise<{ data: WarehouseData | null; error: string | null }> {
  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Authentication error in getWarehouseById:', sessionError);
    return { data: null, error: 'Chyba autentifikácie.' };
  }

  // TODO: Prípadná kontrola oprávnení na čítanie skladu

  // Načítanie dát z databázy
  const { data, error } = await supabase
    .from('warehouses')
    .select('id, name, location, created_at') // Vyber konkrétne polia
    .eq('id', warehouseId)
    .single(); // Očakávame práve jeden výsledok

  if (error) {
    console.error('Error fetching warehouse by ID:', error);
    if (error.code === 'PGRST116') { // Kód pre "Not found"
      return { data: null, error: 'Sklad s daným ID nebol nájdený.' };
    }
    return { data: null, error: `Nepodarilo sa načítať sklad: ${error.message}` };
  }

  // Kontrola, či data nie sú null (aj keď single() by mal vrátiť error)
  if (!data) {
    return { data: null, error: 'Sklad s daným ID nebol nájdený.' };
  }

  return { data, error: null };
}

/**
 * Prijme tovar na sklad. Aktualizuje existujúci záznam alebo vytvorí nový.
 * @param warehouseId ID skladu
 * @param productId ID produktu
 * @param quantity Prijímané množstvo
 */
export async function receiveStock(
  warehouseId: number,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {

  if (quantity <= 0) {
    return { success: false, error: 'Množstvo musí byť kladné číslo.' };
  }

  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
    return { success: false, error: 'Chyba pri overovaní session.' };
  }

  if (!session) {
    return { success: false, error: 'Používateľ nie je prihlásený.' };
  }

  // TODO: Kontrola role (napr. 'admin' alebo 'skladnik')

  try {
    // Získanie aktuálneho množstva (ak existuje)
    const { data: existingItem, error: selectError } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('warehouse_id', warehouseId)
      .eq('product_id', productId)
      .maybeSingle(); // Môže, ale nemusí existovať

    if (selectError) {
      console.error('Error checking existing inventory:', selectError);
      // Skontroluj RLS pre tabuľku inventory!
      return { success: false, error: 'Chyba pri kontrole existujúceho inventára.' };
    }

    if (existingItem) {
      // Ak existuje, aktualizuj množstvo
      const newQuantity = existingItem.quantity + quantity;
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Error updating inventory:', updateError);
        return { success: false, error: 'Nepodarilo sa aktualizovať inventár.' };
      }
    } else {
      // Ak neexistuje, vlož nový záznam
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({
          warehouse_id: warehouseId,
          product_id: productId,
          quantity: quantity,
        });

      if (insertError) {
        console.error('Error inserting inventory:', insertError);
        // Možné chyby: Neexistujúci warehouse_id/product_id (foreign key constraint), RLS
        return { success: false, error: 'Nepodarilo sa pridať nový inventár.' };
      }
    }

    // TODO: Zvážiť pridanie záznamu do `stock_movements`

    return { success: true, error: null };

  } catch (e) {
    console.error('Unexpected error during stock receive:', e);
    return { success: false, error: 'Neočakávaná chyba servera.' };
  }
}

/**
 * Načíta zoznam ostatných skladov (okrem aktuálneho) pre Select komponent.
 * @param currentWarehouseId ID aktuálneho skladu, ktorý sa má vylúčiť
 */
export async function getOtherWarehousesForSelect(
  currentWarehouseId: number
): Promise<{ data: WarehouseSelectItem[] | null; error: string | null }> {
  const supabase = createClient();

  // Session overenie (môže byť redundantné, ak volané z inej overenej akcie, ale pre istotu)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { data: null, error: 'Chyba autentifikácie.' };
  }

  // Načítanie ID a názvu skladov, okrem aktuálneho, zoradené podľa názvu
  const { data, error } = await supabase
    .from('warehouses')
    .select('id, name')
    .neq('id', currentWarehouseId) // Vylúčenie aktuálneho skladu
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching other warehouses:', error);
    // Skontroluj RLS pre tabuľku warehouses!
    return { data: null, error: 'Nepodarilo sa načítať zoznam skladov.' };
  }

  const warehousesData: WarehouseSelectItem[] = data || [];
  return { data: warehousesData, error: null };
}

/**
 * Prevedie tovar medzi skladmi.
 * @param sourceWarehouseId ID zdrojového skladu
 * @param productId ID produktu
 * @param targetWarehouseId ID cieľového skladu
 * @param quantity Množstvo na prevod
 */
export async function transferStock(
  sourceWarehouseId: number,
  productId: number,
  targetWarehouseId: number,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {

  if (quantity <= 0) {
    return { success: false, error: 'Množstvo musí byť kladné číslo.' };
  }
  if (sourceWarehouseId === targetWarehouseId) {
    return { success: false, error: 'Zdrojový a cieľový sklad nemôžu byť rovnaké.' };
  }

  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { success: false, error: 'Chyba autentifikácie.' };
  }

  // TODO: Kontrola role

  // Bez plnej transakcie musíme robiť kroky opatrne.
  // Alternatíva: Vytvoriť databázovú funkciu (RPC) v Supabase, ktorá by to spravila atomicky.

  try {
    // 1. Skontrolovať a znížiť stav v zdrojovom sklade
    const { data: sourceItem, error: sourceSelectError } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('warehouse_id', sourceWarehouseId)
      .eq('product_id', productId)
      .single(); // Očakávame presne jeden záznam

    if (sourceSelectError || !sourceItem) {
      console.error('Error finding source inventory or item not found:', sourceSelectError);
      return { success: false, error: 'Produkt sa nenašiel v zdrojovom sklade.' };
    }

    if (sourceItem.quantity < quantity) {
      return { success: false, error: `Nedostatočné množstvo v zdrojovom sklade (dostupné: ${sourceItem.quantity}).` };
    }

    const newSourceQuantity = sourceItem.quantity - quantity;
    const { error: sourceUpdateError } = await supabase
      .from('inventory')
      .update({ quantity: newSourceQuantity, updated_at: new Date().toISOString() })
      .eq('id', sourceItem.id);

    if (sourceUpdateError) {
      console.error('Error updating source inventory:', sourceUpdateError);
      return { success: false, error: 'Nepodarilo sa aktualizovať zdrojový sklad.' };
      // V tomto bode by sme mali ideálne vrátiť späť zmenu, ak by sme boli v transakcii.
    }

    // 2. Skontrolovať a zvýšiť stav v cieľovom sklade (podobné ako receiveStock)
    const { data: targetItem, error: targetSelectError } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('warehouse_id', targetWarehouseId)
      .eq('product_id', productId)
      .maybeSingle();

    if (targetSelectError) {
      console.error('Error checking target inventory:', targetSelectError);
      // Ak toto zlyhá, máme problém - zdrojový sklad je už znížený!
      // Mali by sme sa pokúsiť vrátiť späť zmenu v zdrojovom sklade.
      // Pre jednoduchosť to teraz neurobíme, ale v produkcii je to nutné.
      return { success: false, error: 'Chyba pri kontrole cieľového skladu.' };
    }

    if (targetItem) {
      // Cieľový záznam existuje -> UPDATE
      const newTargetQuantity = targetItem.quantity + quantity;
      const { error: targetUpdateError } = await supabase
        .from('inventory')
        .update({ quantity: newTargetQuantity, updated_at: new Date().toISOString() })
        .eq('id', targetItem.id);

      if (targetUpdateError) {
        console.error('Error updating target inventory:', targetUpdateError);
        // Opäť, rollback by bol ideálny
        return { success: false, error: 'Nepodarilo sa aktualizovať cieľový sklad.' };
      }
    } else {
      // Cieľový záznam neexistuje -> INSERT
      const { error: targetInsertError } = await supabase
        .from('inventory')
        .insert({
          warehouse_id: targetWarehouseId,
          product_id: productId,
          quantity: quantity,
        });

      if (targetInsertError) {
        console.error('Error inserting into target inventory:', targetInsertError);
        // Rollback...
        return { success: false, error: 'Nepodarilo sa vložiť záznam do cieľového skladu.' };
      }
    }

    // TODO: Záznam do stock_movements pre obe operácie (výdaj zo zdroja, príjem do cieľa)

    return { success: true, error: null };

  } catch (e) {
    console.error('Unexpected error during stock transfer:', e);
    // Pokus o rollback?
    return { success: false, error: 'Neočakávaná chyba servera počas prevodu.' };
  }
}

// --- DELETE WAREHOUSE ---
export async function deleteWarehouse(warehouseId: number): Promise<{ success: boolean; error: string | null }> {
  console.log('Attempting to delete warehouse with ID:', warehouseId); // <-- Log ID
  const supabase = createClient();

  // 1. Check user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { success: false, error: "Authentication required." };
  }

  // TODO: Re-enable admin role check when implemented
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  // if (profile?.role !== 'admin') {
  //   return { success: false, error: "Unauthorized." };
  // }

  try {
    // 2. Check if warehouse has inventory
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*') // Načítaj celý záznam pre lepšie logovanie
      .eq('warehouse_id', warehouseId)
      .limit(1);

    // Logovanie výsledku kontroly zásob
    console.log('Inventory check result for warehouse ID:', warehouseId);
    console.log('Inventory data:', JSON.stringify(inventory, null, 2));
    console.log('Inventory error:', inventoryError);

    if (inventoryError) {
      console.error("Error checking inventory:", inventoryError);
      return { success: false, error: "Nepodarilo sa skontrolovať zásoby skladu." };
    }

    console.log('Inventory check passed for warehouse:', warehouseId, 'Proceeding to delete.');
    if (inventory && inventory.length > 0) {
      return { success: false, error: "Sklad obsahuje zásoby a nemôže byť odstránený." };
    }

    // 3. Delete warehouse if empty
    const { error: deleteError } = await supabase
      .from('warehouses')
      .delete()
      .match({ id: warehouseId });

    if (deleteError) {
      console.error("Error attempting to delete warehouse:", warehouseId, deleteError);
      // Check for specific RLS error (adjust based on actual RLS setup)
      if (deleteError.message.includes('violates row-level security policy')) {
         return { success: false, error: "Nemáte oprávnenie na odstránenie tohto skladu." };
      }
      return { success: false, error: `Nepodarilo sa odstrániť sklad: ${deleteError.message}` };
    }

    // Logovanie úspešného (z pohľadu kódu) pokusu o mazanie
    console.log('Supabase delete call completed without error for warehouse:', warehouseId, 'Revalidating paths...');
    // 4. Revalidate path
    revalidatePath('/admin/sklady');
    revalidatePath('/admin'); // Invaliduj aj layout

    return { success: true, error: null };

  } catch (e) {
    console.error("Unexpected error deleting warehouse:", e);
    return { success: false, error: "Neočakávaná chyba pri odstraňovaní skladu." };
  }
}

/**
 * Vytvorí nový sklad v databáze.
 * @param data Dáta nového skladu (názov, lokalita)
 */
export async function createWarehouse(
  data: CreateWarehouseData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Authentication error in createWarehouse:', sessionError);
    return { success: false, error: 'Chyba autentifikácie.' };
  }

  // TODO: Kontrola role (napr. len admin/manager môže vytvárať sklady)

  // Validácia dát (aj keď Zod to robí na klientovi, overenie na serveri je dobrá prax)
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'Názov skladu je povinný a musí mať aspoň 2 znaky.' };
  }

  // Príprava dát pre vloženie (ošetrenie null/undefined pre location)
  const warehouseToInsert = {
    name: data.name.trim(),
    location: data.location?.trim() || null, // Uloží null ak je location prázdny alebo neuvedený
  };

  // Vloženie do databázy
  const { error } = await supabase
    .from('warehouses')
    .insert(warehouseToInsert);

  if (error) {
    console.error('Error inserting warehouse:', error);
    // Špecifická kontrola pre RLS chybu
    if (error.code === '42501') { // Kód pre RLS chybu v PostgreSQL
        return { success: false, error: 'Chyba oprávnení: Nemáte povolenie na vytvorenie skladu. Skontrolujte RLS politiky.' };
    }
    return { success: false, error: `Nepodarilo sa vytvoriť sklad: ${error.message}` };
  }

  return { success: true, error: null };
}

/**
 * Aktualizuje údaje existujúceho skladu v databáze.
 * @param warehouseId ID skladu na aktualizáciu
 * @param data Nové dáta skladu (názov, lokalita)
 */
export async function updateWarehouse(
  warehouseId: number,
  data: CreateWarehouseData // Môžeme použiť rovnaký interface ako pre create
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Authentication error in updateWarehouse:', sessionError);
    return { success: false, error: 'Chyba autentifikácie.' };
  }

  // TODO: Kontrola role (napr. len admin/manager môže upravovať sklady)

  // Validácia dát
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'Názov skladu je povinný a musí mať aspoň 2 znaky.' };
  }
  if (isNaN(warehouseId) || warehouseId <= 0) {
    return { success: false, error: 'Neplatné ID skladu.' };
  }

  // Príprava dát pre update
  const warehouseToUpdate = {
    name: data.name.trim(),
    location: data.location?.trim() || null,
    // updated_at sa zvyčajne aktualizuje automaticky triggerom v DB, ak je nastavený
  };

  // Update v databáze
  const { error } = await supabase
    .from('warehouses')
    .update(warehouseToUpdate)
    .eq('id', warehouseId);

  if (error) {
    console.error('Error updating warehouse:', error);
    if (error.code === '42501') { // RLS chyba
        return { success: false, error: 'Chyba oprávnení: Nemáte povolenie na úpravu tohto skladu.' };
    }
    // Chyba môže nastať aj ak ID neexistuje, aj keď .eq by nemalo vrátiť error, ale 0 rows affected
    return { success: false, error: `Nepodarilo sa upraviť sklad: ${error.message}` };
  }

  // V Supabase .update nevracia error ak ID neexistuje, len 0 rows affected.
  // Ak by sme chceli explicitne overiť, či sa záznam naozaj našiel a upravil,
  // museli by sme skontrolovať počet ovplyvnených riadkov (čo tento client priamo neposkytuje jednoducho)
  // alebo načítať záznam znova.

  return { success: true, error: null };
}

/**
 * Odstráni (vyskladní) zadané množstvo produktu zo skladu.
 * @param warehouseId ID skladu
 * @param productId ID produktu
 * @param quantity Množstvo na odstránenie
 */
export async function removeInventoryQuantity(
  warehouseId: number,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {

  if (quantity <= 0) {
    return { success: false, error: 'Množstvo musí byť kladné číslo.' };
  }

  const supabase = createClient();

  // Overenie session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { success: false, error: 'Chyba autentifikácie.' };
  }

  // TODO: Kontrola role (napr. 'admin' alebo 'skladnik')

  try {
    // 1. Získať aktuálny stav zásob
    const { data: currentItem, error: selectError } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('warehouse_id', warehouseId)
      .eq('product_id', productId)
      .single(); // Očakávame presne jeden záznam

    if (selectError || !currentItem) {
      console.error('Error finding inventory item or item not found:', selectError);
      return { success: false, error: 'Produkt sa nenašiel v tomto sklade.' };
    }

    // 2. Skontrolovať, či je dostatočné množstvo na vyskladnenie
    if (currentItem.quantity < quantity) {
      return { success: false, error: `Nedostatočné množstvo na sklade (dostupné: ${currentItem.quantity}).` };
    }

    // 3. Vypočítať nové množstvo a aktualizovať záznam
    const newQuantity = currentItem.quantity - quantity;
    const { error: updateError } = await supabase
      .from('inventory')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', currentItem.id);

    if (updateError) {
      console.error('Error updating inventory quantity:', updateError);
      return { success: false, error: 'Nepodarilo sa aktualizovať stav zásob.' };
    }

    // TODO: Zvážiť pridanie záznamu do `stock_movements` (typ 'vyskladnenie' alebo 'remove')

    // 4. Revalidovať relevantné stránky (napríklad detail skladu)
    revalidatePath(`/admin/sklady/${warehouseId}`);
    revalidatePath('/admin/sklady'); // Aj zoznam, ak tam zobrazujeme súhrnné info

    return { success: true, error: null };

  } catch (e) {
    console.error('Unexpected error during inventory removal:', e);
    return { success: false, error: 'Neočakávaná chyba servera pri vyskladňovaní.' };
  }
}

/**
 * Nová funkcia na získanie skladov len s ID a menom pre navigáciu
 */
export async function getWarehousesForNav(): Promise<{
  data: WarehouseSelectItem[] | null;
  error: string | null;
}> {
  const supabase = createClient();

  // Overenie session - je dôležité, aby sme neukazovali navigáciu neprihláseným?
  // Ak áno, odkomentovať:
  /*
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Authentication error in getWarehousesForNav:', sessionError);
    return { data: null, error: 'Chyba autentifikácie.' };
  }
  */
  // TODO: Kontrola role?

  // Získanie iba id a name
  const { data, error } = await supabase
    .from('warehouses')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching warehouses for nav:', error);
    return { data: null, error: 'Nepodarilo sa načítať sklady pre navigáciu.' };
  }

  return { data, error: null };
}
