export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_path: string;
  category: string;
  clothing_category?: string;
  available_sizes?: string; // JSON string of string[]
  color_variants?: string;  // JSON string of string[]
  material?: string;
  sku?: string;
  store_id?: string | number;
  is_try_on_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string | number;
  product_id: string | number;
  quantity: number;
  size?: string;
  product?: Product;
}

export interface Store {
  id: string | number;
  name: string;
  description?: string;
  logo_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
