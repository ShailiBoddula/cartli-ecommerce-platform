import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';

const AuthModal = ({ isOpen, onClose, initialTab = 'signin' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint =
      activeTab === 'signin' ? '/auth/signin' : '/auth/signup';

     const payload =
       activeTab === 'signin'
         ? { email: formData.email, password: formData.password }
         : {
             email: formData.email,
             password: formData.password,
             firstName: formData.firstName,
             lastName: formData.lastName,
             role: formData.role,
           };

    try {
      const res = await api.post(endpoint, payload);

      // 🔍 DEBUG (keep for now)
      console.log('LOGIN RESPONSE:', res.data);

      /**
       * 🔴 IMPORTANT
       * Your backend must return ONE of these:
       * res.data.jwt  OR  res.data.accessToken  OR  res.data.token
       */
      // Extract token from response (backend may return 'jwt', 'accessToken', or 'token')
      const jwt = res.data.jwt || res.data.accessToken || res.data.token;

      if (!jwt) {
        throw new Error('JWT not received from backend');
      }

      // Get current user before clearing
      const currentUser = JSON.parse(window.top.localStorage.getItem('user') || 'null');
      const newUser = {
        id: res.data.id,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        role: res.data.role || 'USER',
      };

      // Clear previous user's data only if logging in as a different user
      if (currentUser && currentUser.id !== newUser.id) {
        window.top.localStorage.removeItem('cartItems');
        window.top.localStorage.removeItem('savedAddress');
        window.top.localStorage.removeItem(`mockOrders_${currentUser.id}`);
      }

      // Store new user info
      window.top.localStorage.setItem('user', JSON.stringify(newUser));

      // Load the new user's saved data (cart, address, orders)
      const userCart = window.top.localStorage.getItem(`cartItems_${newUser.id}`);
      if (userCart) {
        window.top.localStorage.setItem('cartItems', userCart);
      } else {
        window.top.localStorage.removeItem('cartItems');
      }

      const userAddress = window.top.localStorage.getItem(`savedAddress_${newUser.id}`);
      if (userAddress) {
        window.top.localStorage.setItem('savedAddress', userAddress);
      }

      console.log('JWT SAVED:', jwt);
      
      // Store JWT token
      window.top.localStorage.setItem('jwt', jwt);

      onClose();
      // Removed window.location.reload() to avoid origin switching
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2 ${
                  activeTab === 'signin'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 ${
                  activeTab === 'signup'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading
                  ? 'Loading...'
                  : activeTab === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
