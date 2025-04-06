// Typ reprezentujúci produkt z databázy
export interface Product {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: string | null;
    image_url: string | null;
    // Pridaj ďalšie polia podľa tvojej DB schémy
  }
