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
    // Nové polia
    color_detail: string | null;
    taste_detail: string | null;
    aroma_detail: string | null;
    wine_type: string | null;
    wine_region: string | null;
    residual_sugar: string | null;
    sugar_content_nm: string | null;
    volume: string | null;
    storage_temp: string | null;
    serving_temp: string | null;
    batch_number: string | null;
    allergens: string | null;
    alcohol_content: string | null;
    producer: string | null;
    bottler: string | null;
    country_of_origin: string | null;
    ean_link: string | null;
}
