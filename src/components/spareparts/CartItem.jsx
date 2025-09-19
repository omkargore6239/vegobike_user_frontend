import React from 'react';
import { useSpareparts } from '../../context/SparepartsContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useSpareparts();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/64x64?text=Part';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500">{item.brand}</p>
        <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          -
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          ₹{item.price * item.quantity}
        </div>
        
        <button
          onClick={handleRemove}
          className="text-xs text-red-600 hover:text-red-800 mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
