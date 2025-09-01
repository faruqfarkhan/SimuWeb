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
  email: string;
  name?: string;
}
