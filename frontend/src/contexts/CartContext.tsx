import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';
import * as cartService from '../services/cartService';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string | number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'virtual_mall_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from API on initial render
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartData = await cartService.getCart();
      setItems(cartData.items || []);
    } catch (error) {
      console.error('Failed to load cart from API', error);
      // Fallback to localStorage if API fails
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (localError) {
        console.error('Failed to load cart from localStorage', localError);
      }
    } finally {
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sync cart to localStorage whenever it changes (as fallback)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  const addToCart = async (product: Product, quantity: number = 1, size?: string, color?: string) => {
    try {
      const response = await cartService.addToCart(product.id, quantity, size, color);
      setItems(response.items || []);
      return { success: true };
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Fallback to local state if API fails
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          return updatedItems;
        }

        return [
          ...prevItems,
          {
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color,
          },
        ];
      });
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  const removeFromCart = async (itemId: string | number) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setItems(response.items || []);
      return { success: true };
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      // Fallback to local state if API fails
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return { success: false, error: 'Failed to remove item from cart' };
    }
  };

  const updateQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setItems(response.items || []);
      return { success: true };
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      // Fallback to local state if API fails
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
      return { success: false, error: 'Failed to update item quantity' };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setItems([]);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to local state if API fails
      setItems([]);
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  const isInCart = (productId: string | number) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
