import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../config/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user && user.id ? user.id : 'guest';
    
    console.log('Fetching orders for user:', userId);
    console.log('Token exists:', !!token);
    
    if (token) {
      try {
        console.log('Fetching from API...');
        const res = await api.get('/orders');
        console.log('API response:', res.data);
        setOrders(res.data);
        setError(null);
      } catch (err) {
        console.error('API error:', err);
        // Fallback to localStorage for this user
        const localOrders = localStorage.getItem(`mockOrders_${userId}`);
        if (localOrders) {
          try {
            const parsedOrders = JSON.parse(localOrders);
            console.log('Fallback to localStorage:', parsedOrders);
            setOrders(parsedOrders);
          } catch (e) {
            console.error('Error parsing localStorage:', e);
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
        if (err.response?.status !== 401) {
          setError(err.response?.data?.error || 'Failed to fetch orders from server');
        }
      }
    } else {
      // No token - load user's orders from localStorage
      const localOrders = localStorage.getItem(`mockOrders_${userId}`);
      if (localOrders) {
        try {
          const parsedOrders = JSON.parse(localOrders);
          console.log('Loaded from localStorage:', parsedOrders);
          setOrders(parsedOrders);
        } catch (e) {
          console.error('Error parsing localStorage:', e);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    // Map backend status to display status
    const displayStatus = status === 'CREATED' ? 'Ordered' : status;
    switch (displayStatus) {
      case 'Ordered': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-yellow-600 bg-yellow-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentMethodBadge = (method) => {
    if (!method) return null;
    const upperMethod = method.toUpperCase();
    if (upperMethod === 'COD') {
      return <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Cash on Delivery</span>;
    }
    if (upperMethod === 'RAZORPAY' || upperMethod === 'ONLINE') {
      return <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">Paid Online</span>;
    }
    return <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">{method}</span>;
  };

  // Helper to get product data from order item
  const getProductData = (item) => {
    if (!item) return { imageUrl: '', title: '', brand: '', discountedPrice: 0 };
    // Handle both nested and flat structures
    if (item.product && typeof item.product === 'object') {
      return { 
        imageUrl: item.product.imageUrl || '', 
        title: item.product.title || '', 
        brand: item.product.brand || '',
        discountedPrice: item.product.discountedPrice || item.price || 0
      };
    }
    return { 
      imageUrl: item.imageUrl || '', 
      title: item.title || '', 
      brand: item.brand || '',
      discountedPrice: item.discountedPrice || item.price || 0
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-500 mb-4">Showing orders from local storage instead...</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order) => {
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                      {getPaymentMethodBadge(order.paymentMethod)}
                    </div>
                    <p className="text-gray-600">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">
                      Expected Delivery: {new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'CREATED' ? 'Ordered' : order.status}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.orderItems && order.orderItems.map((item) => {
                    const prod = getProductData(item);
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.title}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{prod.brand}</h3>
                          <p className="text-gray-600 text-sm">{prod.title}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-medium">₹{(prod.discountedPrice || 0) * item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total: ₹{order.totalPrice}</span>
                    {order.shippingAddress && (
                      <div className="text-sm text-gray-600">
                        <p>Delivered to: {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Order Details #{selectedOrder.id}</h3>
              {getPaymentMethodBadge(selectedOrder.paymentMethod)}
            </div>
            
            <div className="space-y-4">
              {selectedOrder.orderItems && selectedOrder.orderItems.map((item) => {
                const prod = getProductData(item);
                
                return (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{prod.brand}</h4>
                      <p>{prod.title}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{prod.discountedPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="font-semibold text-lg">Total: ₹{selectedOrder.totalPrice}</p>
              <p className="text-sm text-gray-600">Status: {selectedOrder.status === 'CREATED' ? 'Ordered' : selectedOrder.status}</p>
              {selectedOrder.shippingAddress && (
                <p className="text-sm text-gray-600">
                  Shipping Address: {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region} {selectedOrder.shippingAddress.postalCode}
                </p>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
