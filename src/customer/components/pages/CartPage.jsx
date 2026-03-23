import React, { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { Link } from 'react-router-dom';
import ProductDetailModal from '../ProductDetailModal';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Helper function to extract numeric value from price strings
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      // Remove rupee symbol and commas, then parse
      return parseFloat(price.replace(/[₹,]/g, '')) || 0;
    }
    return typeof price === 'number' ? price : 0;
  };

  const subtotal = cartItems.reduce((total, item) => total + (parsePrice(item.discountedPrice) * item.quantity), 0);
  const originalTotal = cartItems.reduce((total, item) => {
    const price = item.price ? parsePrice(item.price) : parsePrice(item.discountedPrice);
    return total + (price * item.quantity);
  }, 0);
  const discountAmount = originalTotal - subtotal;
  const deliveryFee = subtotal < 500 ? 50 : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer">
              1
            </div>
            <span className="ml-2 text-orange-600 font-medium cursor-pointer">Bag</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <Link to="/checkout" className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm hover:bg-blue-500 hover:text-white transition-colors cursor-pointer">
              2
            </div>
            <span className="ml-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">Address</span>
          </Link>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm cursor-not-allowed">
              3
            </div>
            <span className="ml-2 text-gray-400 cursor-not-allowed">Payment</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="flex items-center space-x-6 border-b pb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => handleProductClick(item)}
                />
                <div className="flex-1 cursor-pointer" onClick={() => handleProductClick(item)}>
                  <h3 className="text-xl font-semibold">{item.brand}</h3>
                  <p className="text-gray-600 mb-1">{item.title}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-blue-600 font-medium mb-2">Size: {item.selectedSize}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {typeof item.discountedPrice === 'number' ? `₹${item.discountedPrice}` : item.discountedPrice}
                    </p>
                    {item.price && (
                      <p className="text-sm text-gray-500 line-through">
                        {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                      </p>
                    )}
                    {item.discountPersent && (
                      <p className="text-sm text-green-600 font-medium">
                        {typeof item.discountPersent === 'number' ? `${item.discountPersent}% off` : item.discountPersent}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Price Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                <span>₹{originalTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discountAmount}</span>
                </div>
              )}
              {deliveryFee > 0 ? (
                <div className="flex justify-between items-center text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="text-red-500">₹{deliveryFee}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-green-600">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              )}
              {subtotal < 500 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Add ₹{500 - subtotal} more</span> to get FREE delivery
                  </p>
                </div>
              )}
              <div className="border-t border-gray-300 pt-3 mt-4">
                <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
                {subtotal >= 500 && (
                  <p className="text-sm text-green-600 mt-1">
                    You saved ₹50 on delivery!
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 text-center font-medium transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 text-center font-medium transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
      {showModal && <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
};

export default CartPage;