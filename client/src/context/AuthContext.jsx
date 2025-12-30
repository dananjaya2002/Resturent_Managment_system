/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Configure axios base URL - ideally from env
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Attach token to requests if it exists
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      if (token) {
        try {
          // Verify token and get profile
          const { data } = await api.get("/auth/profile");
          setUser(data);
        } catch (error) {
          console.error("Info: Token invalid or expired");
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
