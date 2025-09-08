export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  dataAiHint: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export interface User {
  id: number; // Changed from string to number to match DB schema
  email: string;
  name?: string | null; // Allow name to be nullable to match DB schema
}

export interface Order {
    id: number;
    transaction_id: string;
    user_id: number;
    total_amount: number;
    shipping_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_zip: string;
    order_date: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_per_unit: number;
}
