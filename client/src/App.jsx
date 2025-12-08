import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Placeholder components
const Home = () => (
  <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
      Delicious Food, <br /> Delivered To You
    </h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
      Order your favorite meals from the best restaurants.
    </p>
    <button className="btn btn-primary">Order Now</button>
  </div>
);

const Login = () => <div className="container">Login Page</div>;
const Register = () => <div className="container">Register Page</div>;
const Menu = () => <div className="container">Menu Page</div>;

function App() {
  return (
    <div className="app">
      <nav style={{ background: 'white', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>RestoApp</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/">Home</a>
            <a href="/menu">Menu</a>
            <a href="/login">Login</a>
            <a href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</a>
          </div>
        </div>
      </nav>

      <main style={{ padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
