export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  // Oprava: Zmena z imageUrl na image_url
  image_url: string | null;
  created_at: string;
  alcohol_content: number | null;
  volume: number | null;
  vintage: number | null;
  wine_type: string | null;
  wine_color: string | null;
  sugar_content: string | null;
  origin_country: string | null;
  wine_region: string | null;
  aroma: string | null;
  taste: string | null;
  serving_temp: string | null;
  storage_temp: string | null;
  food_pairing: string | null;
  allergens: string | null;
  producer: string | null;
  bottler: string | null;
  ean: string | null;
  stock_quantity: number | null; // Tento možno nahradíme novým systémom
  is_featured: boolean | null;
  is_active: boolean | null;
  slug: string | null;
  residual_sugar: string | null;
  acid_content: string | null;
  batch_number: string | null;
  vineyard_location: string | null;
  harvest_date: string | null;
  bottling_date: string | null;
  awards: string | null;
  aroma_detail: string | null;
  taste_detail: string | null;
  labeled_equivalent_id: number | null; // Pridaný stĺpec
};

export type Order = {
  id: number;
  created_at: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  shipping_address: any | null; // JSONB - zvážiť presnejší typ
  billing_address: any | null; // JSONB - zvážiť presnejší typ
  payment_intent_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_method: string | null;
  shipping_cost: number | null;
  notes: string | null;
  invoice_number: string | null;
  dic: string | null;
  ico: string | null;
  ic_dph: string | null;
  variable_symbol: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_per_unit: number;
  product?: Pick<Product, 'name' | 'image_url'>; // Voliteľne načítané meno a obrázok produktu
};

// Nové typy pre sklady

export type Warehouse = {
  id: number;
  name: string;
  created_at: string;
};

export type InventoryItem = {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  updated_at: string;
  product?: Pick<Product, 'name' | 'image_url'>; // Voliteľne pre zobrazenie názvu produktu
  warehouse?: Pick<Warehouse, 'name'>; // Voliteľne pre zobrazenie názvu skladu
};

export type InventoryItemWithProduct = InventoryItem & {
  // Oprava: Zmena z 'product' na 'products', aby to sedelo s tým, čo vracia Supabase
  // Oprava: Zmena z imageUrl na image_url
  products: Pick<Product, 'id' | 'name' | 'category' | 'image_url'> | null; 
};

export type WarehouseDetail = Warehouse & {
  inventory: InventoryItemWithProduct[];
};

export type StockMovement = {
  id: number;
  product_id: number;
  quantity: number;
  movement_type: string; // Zvážiť presnejší typ (enum/literal) neskôr
  from_warehouse_id: number | null;
  to_warehouse_id: number | null;
  timestamp: string;
  related_order_id: number | null;
  user_id: string | null;
  notes: string | null;
  product?: Pick<Product, 'name'>; // Voliteľne
  fromWarehouse?: Pick<Warehouse, 'name'>; // Voliteľne
  toWarehouse?: Pick<Warehouse, 'name'>; // Voliteľne
};

// Typ pre user session (príklad, uprav podľa potreby)
export type UserSession = {
  id: string;
  email?: string;
  // ... ďalšie polia zo session
} | null;
