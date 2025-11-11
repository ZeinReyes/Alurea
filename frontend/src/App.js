import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import VerifyEmail from './pages/authentication/verifyEmail';
import AdminPage from './pages/admin/dashboard';
import ClientPage from './pages/client/ClientPage';
import ClientProductPage from './pages/client/ClientProductPage';
import CartPage from './pages/client/ClientCartPage';
import CheckoutPage from './pages/client/ClientCheckoutPage';
import OrderPage from './pages/client/ClientOrderPage';
import ProductDetails from './pages/client/ProductDetailPage';
import ProfilePage from './pages/client/ProfilePage';
import OrderTrackingPage from './pages/client/OrderTrackingPage';
import RiderOrders from './pages/rider/RiderPage';
import Layout from './layouts/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public / Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Client pages (accessible to everyone, including admin) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<ClientPage />} />
        <Route path="products" element={<ClientProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderPage />} />
      </Route>

      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />

      {/* Admin-only route protection */}
      <Route
        path="/admin"
        element={
          user ? (
            user.role === 'admin' ? (
              <AdminPage />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rider-only route protection */}
      <Route
        path="/rider/orders"
        element={
          user ? (
            user.role === 'rider' ? (
              <RiderOrders />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback redirect */}
      <Route
        path="*"
        element={
          user ? (
            user.role === 'admin' ? (
              <Navigate to="/admin" />
            ) : user.role === 'rider' ? (
              <Navigate to="/rider/orders" />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
