import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 15,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchCategories();
      fetchMenuItems();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/menu`);
      setMenuItems(data);
    } catch (err) {
      setError("Failed to fetch menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(
          `${API_URL}/menu/${editingItem._id}`,
          itemForm,
          getAuthHeaders()
        );
      } else {
        await axios.post(`${API_URL}/menu`, itemForm, getAuthHeaders());
      }
      setShowItemModal(false);
      resetItemForm();
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(
          `${API_URL}/categories/${editingCategory._id}`,
          categoryForm,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          `${API_URL}/categories`,
          categoryForm,
          getAuthHeaders()
        );
      }
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/menu/${id}`, getAuthHeaders());
        fetchMenuItems();
      } catch (error) {
        setError("Failed to delete menu item");
        console.error(error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`, getAuthHeaders());
        fetchCategories();
      } catch (error) {
        setError("Failed to delete category");
        console.error(error);
      }
    }
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category._id || item.category,
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      preparationTime: item.preparationTime,
    });
    setShowItemModal(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      isActive: category.isActive,
      order: category.order,
    });
    setShowCategoryModal(true);
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      isAvailable: true,
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 15,
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      imageUrl: "",
      isActive: true,
      order: 0,
    });
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>

      {error && (
        <div
          style={{
            padding: "1rem",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "var(--border-radius)",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("menu")}
          className={activeTab === "menu" ? "btn btn-primary" : "btn"}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={activeTab === "categories" ? "btn btn-primary" : "btn"}
        >
          Categories
        </button>
      </div>

      {/* Menu Items Tab */}
      {activeTab === "menu" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h2>Menu Items</h2>
            <button
              onClick={() => {
                resetItemForm();
                setShowItemModal(true);
              }}
              className="btn btn-primary"
            >
              + Add Menu Item
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>
                      Category
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>
                      Price
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr
                      key={item._id}
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td style={{ padding: "1rem" }}>{item.name}</td>
                      <td style={{ padding: "1rem" }}>
                        {item.category?.name || "N/A"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "var(--border-radius)",
                            background: item.isAvailable
                              ? "var(--success-light)"
                              : "#ffebee",
                            color: item.isAvailable
                              ? "var(--success-color)"
                              : "#c62828",
                          }}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button
                          onClick={() => openEditItem(item)}
                          className="btn"
                          style={{
                            marginRight: "0.5rem",
                            padding: "0.25rem 0.75rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="btn"
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#ffebee",
                            color: "#c62828",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h2>Categories</h2>
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryModal(true);
              }}
              className="btn btn-primary"
            >
              + Add Category
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
              }}
            >
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>
                    Description
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Order</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "1rem" }}>{category.name}</td>
                    <td style={{ padding: "1rem" }}>
                      {category.description || "N/A"}
                    </td>
                    <td style={{ padding: "1rem" }}>{category.order}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "var(--border-radius)",
                          background: category.isActive
                            ? "var(--success-light)"
                            : "#ffebee",
                          color: category.isActive
                            ? "var(--success-color)"
                            : "#c62828",
                        }}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => openEditCategory(category)}
                        className="btn"
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.25rem 0.75rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="btn"
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#ffebee",
                          color: "#c62828",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {showItemModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--border-radius)",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h2>
            <form onSubmit={handleItemSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>Name *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Description *</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  required
                  rows="3"
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, price: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Category *</label>
                <select
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Image URL</label>
                <input
                  type="text"
                  value={itemForm.imageUrl}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, imageUrl: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Preparation Time (minutes)</label>
                <input
                  type="number"
                  value={itemForm.preparationTime}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      preparationTime: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        isAvailable: e.target.checked,
                      })
                    }
                  />{" "}
                  Available
                </label>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={itemForm.isVegetarian}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        isVegetarian: e.target.checked,
                      })
                    }
                  />{" "}
                  Vegetarian
                </label>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={itemForm.isSpicy}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, isSpicy: e.target.checked })
                    }
                  />{" "}
                  Spicy
                </label>
              </div>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button type="submit" className="btn btn-primary">
                  {editingItem ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowItemModal(false);
                    resetItemForm();
                  }}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "var(--border-radius)",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleCategorySubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Image URL</label>
                <input
                  type="text"
                  value={categoryForm.imageUrl}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, order: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        isActive: e.target.checked,
                      })
                    }
                  />{" "}
                  Active
                </label>
              </div>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
