import React, { useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Cart from "./components/Cart";

import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import ChefDashboard from "./pages/chef/ChefDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";

// ... existing imports

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "white",
        padding: "1rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "var(--primary-color)",
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          RestoApp
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          {user && <Link to="/orders">My Orders</Link>}
          {user && user.role === "admin" && <Link to="/admin">Admin</Link>}
          {user && user.role === "waiter" && <Link to="/waiter">Waiter</Link>}
          {user && user.role === "chef" && <Link to="/chef">Chef</Link>}
          {user && user.role === "cashier" && <Link to="/cashier">Cashier</Link>}
          {user && user.role === "manager" && <Link to="/manager">Manager</Link>}
          {user && user.role === "owner" && <Link to="/owner">Owner</Link>}
          {user && (user.role === "manager" || user.role === "owner" || user.role === "chef" || user.role === "admin") && <Link to="/inventory">Inventory</Link>}

          {user ? (
            <>
              <span style={{ fontWeight: "bold" }}>{user.name} ({user.role})</span>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--error-color)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <div className="app">
            <Navigation />
            <Cart />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:orderId" element={<OrderTracking />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/waiter" element={<WaiterDashboard />} />
                <Route path="/chef" element={<ChefDashboard />} />
                <Route path="/cashier" element={<CashierDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/inventory" element={<InventoryDashboard />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
