import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(window.top.localStorage.getItem('user') || 'null');
  const role = user?.role;

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
