import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navbar from './customer/components/Navbar';

import WomenPage from './customer/components/pages/WomenPage';
import MenPage from './customer/components/pages/MenPage';
import CompanyPage from './customer/components/pages/CompanyPage';
import ProductsPage from './customer/components/pages/ProductsPage';
import CartPage from './customer/components/pages/CartPage';
import CheckoutPage from './customer/components/pages/CheckoutPage';
import OrdersPage from './customer/components/pages/OrdersPage';
import OrderSuccessPage from './customer/components/pages/OrderSuccessPage';

// ✅ ADD THIS
import ProductDetails from './customer/components/pages/ProductDetails';

// Admin components
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/components/Dashboard';
import AddProductForm from './admin/components/AddProductForm';
import ProductManagement from './admin/components/ProductManagement';
import OrderManagement from './admin/components/OrderManagement';

// Protected route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<Navigate to="/women" replace />} />
          <Route path="/women" element={<Navbar><WomenPage /></Navbar>} />
          <Route path="/men" element={<Navbar><MenPage /></Navbar>} />
          <Route path="/products" element={<Navbar><ProductsPage /></Navbar>} />
          <Route path="/product/:id" element={<Navbar><ProductDetails /></Navbar>} /> {/* ✅ THIS */}
          <Route path="/cart" element={<Navbar><CartPage /></Navbar>} />
          <Route path="/checkout" element={<Navbar><CheckoutPage /></Navbar>} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<Navbar><OrdersPage /></Navbar>} />
          <Route path="/company" element={<Navbar><CompanyPage /></Navbar>} />

          {/* Admin routes - protected */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AddProductForm />} />
              <Route path="add-product" element={<AddProductForm />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
