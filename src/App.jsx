import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./layouts/Layout";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ComingSoon from "./pages/ComingSoon";
import Login from "./components/Login";
// Create placeholder components for now if they don't exist, or reuse existing
import Cart from "./components/Cart";
import MyOrders from "./components/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner"></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="spinner"></div>;
  return user && userRole === 'admin' ? children : <Navigate to="/" />;
};

// Wrapper for Cart to pass props
const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  return <Cart cart={cart} onRemove={removeFromCart} onClear={clearCart} />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="login" element={<Login />} />

              <Route path="cart" element={<CartPage />} />

              <Route path="my-orders" element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } />

              <Route path="admin/orders" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
