import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/api";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? `${API_URL}/menu?isAvailable=true`
          : `${API_URL}/menu?category=${selectedCategory}&isAvailable=true`;

      const { data } = await axios.get(url);
      setMenuItems(data);
      setError("");
    } catch (err) {
      setError("Failed to load menu items");
      console.error("Error fetching menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    // Show a brief success message
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Added! ✓";
    btn.style.background = "#4caf50";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
    }, 1500);
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Our Menu</h1>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          overflowX: "auto",
          padding: "0.5rem",
        }}
      >
        <button
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory === "all" ? "btn btn-primary" : "btn"}
          style={{ whiteSpace: "nowrap" }}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={
              selectedCategory === category._id ? "btn btn-primary" : "btn"
            }
            style={{ whiteSpace: "nowrap" }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && <p style={{ textAlign: "center" }}>Loading menu...</p>}

      {/* Error State */}
      {error && (
        <p style={{ color: "var(--danger-color)", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* Menu Items Grid */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {menuItems.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
              No items available in this category
            </p>
          ) : (
            menuItems.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "white",
                  borderRadius: "var(--border-radius)",
                  padding: "1.5rem",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Item Image Placeholder */}
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>
                      No Image
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    minHeight: "3rem",
                  }}
                >
                  {item.description}
                </p>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {item.isVegetarian && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        background: "var(--success-light)",
                        color: "var(--success-color)",
                        borderRadius: "var(--border-radius)",
                      }}
                    >
                      🌱 Vegetarian
                    </span>
                  )}
                  {item.isSpicy && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        background: "#ffebee",
                        color: "#d32f2f",
                        borderRadius: "var(--border-radius)",
                      }}
                    >
                      🌶️ Spicy
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      background: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      borderRadius: "var(--border-radius)",
                    }}
                  >
                    ⏱️ {item.preparationTime} min
                  </span>
                </div>

                {/* Price and Add to Cart */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "var(--primary-color)",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn btn-primary"
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
