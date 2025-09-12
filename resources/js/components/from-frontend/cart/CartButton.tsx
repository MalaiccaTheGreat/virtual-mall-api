import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export const CartButton = () => {
  const { itemCount } = useCart();

  return (
    <Link
      to="/cart"
      className="group -m-2 flex items-center p-2 text-gray-400 hover:text-gray-500 relative"
    >
      <ShoppingCartIcon
        className="h-6 w-6 flex-shrink-0"
        aria-hidden="true"
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        Cart
      </span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
      <span className="sr-only">items in cart, view cart</span>
    </Link>
  );
};
