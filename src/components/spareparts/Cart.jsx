import React from 'react';
import { Link } from 'react-router-dom';
import { useSpareparts } from '../../context/SparepartsContext';
import CartItem from './CartItem';

const Cart = () => {
  const { cart, getCartTotal } = useSpareparts();

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-gray-400 text-4xl mb-4">🛒</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-4">
          Add some spare parts to get started
        </p>
        <Link
          to="/spareparts"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Parts
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Shopping Cart ({cart.length} items)
      </h3>
      
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-primary">₹{getCartTotal()}</span>
        </div>
        
        <Link
          to="/spareparts/checkout"
          className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
