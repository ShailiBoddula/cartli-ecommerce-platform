import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

const MobileNav = ({ isAuthModalOpen, setIsAuthModalOpen, authTab, setAuthTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <Link to="/" className="text-2xl font-bold text-gray-900">CartLi</Link>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="h-6 w-6 text-gray-700" /> : <Bars3Icon className="h-6 w-6 text-gray-700" />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-white border-b border-gray-200">
          <div className="flex flex-col space-y-4 px-4 py-4">
            <Link to="/women" className="text-black hover:text-gray-900" onClick={() => setIsOpen(false)}>Women</Link>
            <Link to="/men" className="text-black hover:text-gray-900" onClick={() => setIsOpen(false)}>Men</Link>
            <Link to="/orders" className="text-black hover:text-gray-900" onClick={() => setIsOpen(false)}>Orders</Link>
            <Link to="/company" className="text-black hover:text-gray-900" onClick={() => setIsOpen(false)}>Company</Link>
            {isAdmin && <Link to="/admin" className="text-black hover:text-gray-900" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
            {user ? (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-700 hover:text-gray-900 flex items-center">
                  <UserIcon className="h-6 w-6" />
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 bg-gray-50 rounded-md">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setAuthTab('signin'); setIsAuthModalOpen(true); setIsOpen(false); }}
                  className="text-gray-700 hover:text-gray-900 text-left"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setAuthTab('signup'); setIsAuthModalOpen(true); setIsOpen(false); }}
                  className="text-gray-700 hover:text-gray-900 text-left"
                >
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;