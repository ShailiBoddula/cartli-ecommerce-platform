import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const DesktopNav = ({ isAuthModalOpen, setIsAuthModalOpen, authTab, setAuthTab }) => {
  const { getTotalItems } = useCart();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Save current user's data before logout
    if (user) {
      const cartItems = localStorage.getItem('cartItems');
      if (cartItems) {
        localStorage.setItem(`cartItems_${user.id}`, cartItems);
      }
      
      const savedAddress = localStorage.getItem('savedAddress');
      if (savedAddress) {
        localStorage.setItem(`savedAddress_${user.id}`, savedAddress);
      }
      
      const mockOrders = localStorage.getItem('mockOrders');
      if (mockOrders) {
        localStorage.setItem(`mockOrders_${user.id}`, mockOrders);
      }
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('savedAddress');
    localStorage.removeItem('mockOrders');
    navigate('/');
  };
  return (
    <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">CartLi</Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex space-x-8">
          <button onClick={() => handleNavigate('/women')} className="text-black hover:text-gray-900">Women</button>
          <button onClick={() => handleNavigate('/men')} className="text-black hover:text-gray-900">Men</button>
          <button onClick={() => handleNavigate('/company')} className="text-black hover:text-gray-900">Company</button>
          {isAdmin && <button onClick={() => handleNavigate('/admin')} className="text-black hover:text-gray-900">Admin Dashboard</button>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-700 hover:text-gray-900">
              <UserIcon className="h-6 w-6" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => { setAuthTab('signin'); setIsAuthModalOpen(true); }}
              className="text-gray-700 hover:text-gray-900"
            >
              Sign in
            </button>
            <button
              onClick={() => { setAuthTab('signup'); setIsAuthModalOpen(true); }}
              className="text-gray-700 hover:text-gray-900"
            >
              Create account
            </button>
          </>
        )}
        <Link to="/cart" className="relative">
          <ShoppingBagIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default DesktopNav;