import React, { useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Cart from "./components/Cart";

// Placeholder components
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div
      className="container"
      style={{ textAlign: "center", marginTop: "4rem" }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "var(--primary-color)",
        }}
      >
        Delicious Food, <br /> Delivered To You
      </h1>
      {user ? (
        <>
          <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
            Welcome back, {user.name} ({user.role})!
          </p>
          <button
            onClick={logout}
            className="btn"
            style={{ border: "1px solid #ccc" }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
            }}
          >
            Order your favorite meals from the best restaurants.
          </p>
          <Link to="/login" className="btn btn-primary">
            Order Now
          </Link>
        </>
      )}
    </div>
  );
};

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
          {user ? (
            <>
              <span style={{ fontWeight: "bold" }}>{user.name}</span>
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
      <CartProvider>
        <div className="app">
          <Navigation />
          <Cart />

          <main style={{ padding: "2rem 0" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:orderId" element={<OrderTracking />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
