import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { ReactNode } from 'react';

// Test component that uses the cart
const TestComponent = () => {
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    itemCount,
    totalPrice 
  } = useCart();

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <button onClick={() => addToCart({ id: 1, name: 'Test Product', price: 99.99, image: '', stock: 10 })}>
        Add to Cart
      </button>
      <button onClick={() => removeFromCart(1)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(1, 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
      <ul>
        {items.map(item => (
          <li key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('CartContext', () => {
  // Wrapper component to provide cart context
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  it('adds item to cart', () => {
    render(<TestComponent />, { wrapper });

    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('99.99');
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
  });

  it('removes item from cart', () => {
    render(<TestComponent />, { wrapper });

    // Add then remove item
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Remove from Cart'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
  });

  it('updates item quantity', () => {
    render(<TestComponent />, { wrapper });

    // Add item then update quantity
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Update Quantity'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('199.98');
  });

  it('clears the cart', () => {
    render(<TestComponent />, { wrapper });

    // Add item then clear cart
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Clear Cart'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
  });

  it('persists cart in localStorage', async () => {
    const { unmount } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item
    fireEvent.click(screen.getByText('Add to Cart'));
    
    // Unmount component
    unmount();

    // Remount and check if cart is restored
    render(<TestComponent />, { wrapper });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
  });
});
