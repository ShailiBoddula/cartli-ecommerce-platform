import React, { useState, useEffect } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../config/api';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center`}>
      <span className="mr-2">{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      {message}
    </div>
  );
};

/**
 * Handle Razorpay mock payment flow - works like COD, just show success and redirect
 */
const handleRazorpayPayment = async (totalPrice, navigate, formData, cartItems, clearCart, setToast) => {
  try {
    setToast({ message: 'Processing payment...', type: 'info' });

    // Get auth token
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';

    // Try to create order via backend API if user is logged in
    if (token && user) {
      try {
        const addressData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.address,
          city: formData.city,
          state: formData.region,
          zipCode: formData.postalCode
        };

        const response = await api.post('/orders', addressData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Order created via API:', response.data);

        // Clear cart after placing order
        clearCart();

        setToast({ message: 'Payment Successful! Your order has been placed.', type: 'success' });
        navigate('/order-success');
        return;
      } catch (apiError) {
        console.error('API order creation failed, falling back to localStorage:', apiError);
        // Fall through to localStorage fallback
      }
    }

    // Fallback to localStorage for non-logged in users or if API fails
    const mockOrder = {
      id: Date.now(),
      orderDate: new Date().toISOString(),
      status: 'Ordered',
      paymentMethod: 'Razorpay',
      totalPrice: totalPrice,
      orderItems: cartItems.map(item => ({
        id: item.cartItemId || item.id,
        product: item,
        quantity: item.quantity,
        price: item.discountedPrice
      })),
      shippingAddress: formData
    };

    const existingOrders = JSON.parse(localStorage.getItem(`mockOrders_${userId}`) || '[]');
    existingOrders.push(mockOrder);
    localStorage.setItem(`mockOrders_${userId}`, JSON.stringify(existingOrders));

    // Clear cart after placing order
    clearCart();

    setToast({ message: 'Payment Successful! Your order has been placed.', type: 'success' });
    navigate('/order-success');

  } catch (error) {
    console.error('Payment failed:', error);
    const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
    setToast({ message: errorMessage, type: 'error' });
    throw error;
  }
};

/**
 * Handle Cash on Delivery
 */
const handleCOD = async (totalPrice, navigate, formData, cartItems, clearCart, setToast) => {
  try {
    setToast({ message: 'Processing your order...', type: 'info' });

    // Get auth token
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';

    // Try to create order via backend API if user is logged in
    if (token && user) {
      try {
        const addressData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.address,
          city: formData.city,
          state: formData.region,
          zipCode: formData.postalCode
        };

        const response = await api.post('/orders', addressData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Order created via API:', response.data);

        // Clear cart after placing order
        clearCart();

        setToast({ message: 'Order placed successfully! You will pay cash on delivery.', type: 'success' });
        navigate('/order-success');
        return;
      } catch (apiError) {
        console.error('API order creation failed, falling back to localStorage:', apiError);
        // Fall through to localStorage fallback
      }
    }

    // Fallback to localStorage for non-logged in users or if API fails
    const mockOrder = {
      id: Date.now(),
      orderDate: new Date().toISOString(),
      status: 'Ordered',
      paymentMethod: 'COD',
      totalPrice: totalPrice,
      orderItems: cartItems.map(item => ({
        id: item.cartItemId || item.id,
        product: item,
        quantity: item.quantity,
        price: item.discountedPrice
      })),
      shippingAddress: formData
    };

    const existingOrders = JSON.parse(localStorage.getItem(`mockOrders_${userId}`) || '[]');
    existingOrders.push(mockOrder);
    localStorage.setItem(`mockOrders_${userId}`, JSON.stringify(existingOrders));

    // Clear cart after placing order
    clearCart();

    setToast({ message: 'Order placed successfully! You will pay cash on delivery.', type: 'success' });
    navigate('/order-success');

  } catch (error) {
    console.error('Order failed:', error);
    const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
    setToast({ message: errorMessage, type: 'error' });
    throw error;
  }
};

/**
 * Unified payment handler
 */
const handlePayment = async (totalPrice, navigate, formData, paymentMethod, cartItems, clearCart, setToast) => {
  if (paymentMethod === 'cod') {
    await handleCOD(totalPrice, navigate, formData, cartItems, clearCart, setToast);
  } else {
    await handleRazorpayPayment(totalPrice, navigate, formData, cartItems, clearCart, setToast);
  }
};

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, fetchCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('address');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    phoneNumber: ''
  });
  const [savedAddress, setSavedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user
    const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    // Load saved address for this user from localStorage
    let address = JSON.parse(window.top.localStorage.getItem(`savedAddress_${userId}`) || 'null');
    if (!address) {
      // Set default address
      address = {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'New York',
        region: 'NY',
        postalCode: '10001',
        phoneNumber: '123-456-7890'
      };
    }
    setSavedAddress(address);
    setFormData(address);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDeliverHere = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.region || !formData.postalCode || !formData.phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Save address as default for this user
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    localStorage.setItem(`savedAddress_${userId}`, JSON.stringify(formData));
    
    setCurrentStep('summary');
  };

  const handlePaymentClick = async () => {
    setLoading(true);
    setError('');
    try {
      await handlePayment(totalAmount, navigate, formData, paymentMethod, cartItems, clearCart, setToast);
    } catch (error) {
      // Error handled in handlePayment
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = typeof item.discountedPrice === 'string' 
      ? parseFloat(item.discountedPrice.replace(/[₹,]/g, '')) 
      : item.discountedPrice;
    return total + (price * item.quantity);
  }, 0);
  
  const deliveryFee = subtotal < 500 ? 50 : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-6xl mx-auto">
        {/* Checkout Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <Link to="/cart" className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold text-sm hover:bg-green-600 transition-colors cursor-pointer">
                ✓
              </div>
              <span className="ml-2 text-green-600 font-medium hover:text-green-700 transition-colors cursor-pointer">Bag</span>
            </Link>
            <div className={`w-12 h-0.5 ${currentStep === 'address' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${currentStep === 'address' ? 'bg-orange-500' : 'bg-green-500'} text-white rounded-full flex items-center justify-center font-semibold text-sm`}>
                {currentStep === 'address' ? '2' : '✓'}
              </div>
              <span className={`ml-2 ${currentStep === 'address' ? 'text-orange-600' : 'text-green-600'} font-medium`}>Address</span>
            </div>
            <div className={`w-12 h-0.5 ${currentStep === 'summary' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${(currentStep === 'summary' || currentStep === 'payment') ? 'bg-orange-500' : 'bg-gray-300'} ${(currentStep === 'summary' || currentStep === 'payment') ? 'text-white' : 'text-gray-500'} rounded-full flex items-center justify-center font-semibold text-sm ${(currentStep !== 'summary' && currentStep !== 'payment') ? 'cursor-not-allowed' : ''}`}>
                {currentStep === 'payment' ? '✓' : '3'}
              </div>
              <span className={`ml-2 ${(currentStep === 'summary' || currentStep === 'payment') ? 'text-orange-600' : 'text-gray-400'} ${(currentStep !== 'summary' && currentStep !== 'payment') ? 'cursor-not-allowed' : ''}`}>Summary</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${currentStep === 'payment' ? 'bg-orange-500' : 'bg-gray-300'} ${currentStep === 'payment' ? 'text-white' : 'text-gray-500'} rounded-full flex items-center justify-center font-semibold text-sm ${currentStep !== 'payment' ? 'cursor-not-allowed' : ''}`}>
                4
              </div>
              <span className={`ml-2 ${currentStep === 'payment' ? 'text-orange-600' : 'text-gray-400'} ${currentStep !== 'payment' ? 'cursor-not-allowed' : ''}`}>Payment</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {currentStep === 'address' && (
          <div className="max-w-2xl mx-auto">
            {/* Delivery Address Section */}
            <div>
              {savedAddress && !useNewAddress ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-6">Select Delivery Address</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{savedAddress.firstName} {savedAddress.lastName}</h3>
                          <p className="text-gray-600 mt-1">{savedAddress.address}</p>
                          <p className="text-gray-600">{savedAddress.city}, {savedAddress.region} {savedAddress.postalCode}</p>
                          <p className="text-gray-600">Phone: {savedAddress.phoneNumber}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setFormData(savedAddress);
                              setCurrentStep('summary');
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                            Deliver Here
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUseNewAddress(true);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          address: '',
                          city: '',
                          region: '',
                          postalCode: '',
                          phoneNumber: ''
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add New Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Region/State *
                        </label>
                        <input
                          type="text"
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter region/state"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleDeliverHere}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium transition-colors"
                    >
                      Deliver Here
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'summary' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Delivery Address Summary */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
                <div className="space-y-2">
                  <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.region} {formData.postalCode}</p>
                  <p>Phone: {formData.phoneNumber}</p>
                </div>
                <button
                  onClick={() => setCurrentStep('address')}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change Address
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.brand}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(typeof item.discountedPrice === 'string' ? parseFloat(item.discountedPrice.replace(/[₹,]/g, '')) : item.discountedPrice) * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">Select a payment method:</p>
                
                {/* Razorpay Option */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">Online Payment (Razorpay)</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">MOCK</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Credit/Debit Card, UPI, Net Banking</p>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay when you receive the order</p>
                  </div>
                </label>
              </div>

              <button
                onClick={handlePaymentClick}
                disabled={loading}
                className={`w-full mt-6 bg-black text-white py-3 rounded-lg font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                {paymentMethod === 'razorpay' 
                  ? 'This is a mock payment - no real money will be charged.'
                  : 'You will pay in cash when the order is delivered.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
