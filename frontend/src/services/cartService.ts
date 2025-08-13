import { CartItem } from '../types';

const API_BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    (error as any).status = response.status;
    throw error;
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data.data as T;
};

export const cartService = {
  // Get cart items
  async getCart(): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<CartResponse>(response);
  },

  // Add item to cart
  async addToCart(productId: number | string, quantity: number, size?: string, color?: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        size,
        color,
      }),
    });
    return handleResponse<CartResponse>(response);
  },

  // Update cart item quantity
  async updateCartItem(itemId: number | string, quantity: number): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<CartResponse>(response);
  },

  // Remove item from cart
  async removeFromCart(itemId: number | string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<CartResponse>(response);
  },

  // Clear cart
  async clearCart(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ success: boolean }>(response);
  },

  // Get cart count
  async getCartCount(): Promise<{ count: number }> {
    const response = await fetch(`${API_BASE_URL}/cart/count`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ count: number }>(response);
  },
};
