import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";

const TableAllocation = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, available, occupied

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tables");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/tables/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTables(); // Refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredTables = tables.filter((table) => {
    if (filter === "all") return true;
    return table.status === filter;
  });

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Tables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="table-allocation">
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🪑</div>
          <div className="stat-content">
            <p className="stat-label">Total Tables</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Available</p>
            <p className="stat-value">{stats.available}</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Occupied</p>
            <p className="stat-value">{stats.occupied}</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({stats.total})
        </button>
        <button
          className={`filter-btn ${filter === "available" ? "active" : ""}`}
          onClick={() => setFilter("available")}
        >
          Available ({stats.available})
        </button>
        <button
          className={`filter-btn ${filter === "occupied" ? "active" : ""}`}
          onClick={() => setFilter("occupied")}
        >
          Occupied ({stats.occupied})
        </button>
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {filteredTables.map((table) => (
          <div
            key={table._id}
            className={`table-card ${
              table.status === "occupied" ? "occupied" : "available"
            }`}
          >
            <div className="table-card-header">
              <div className="table-number">Table {table.tableNumber}</div>
              <div className={`status-indicator ${table.status}`}></div>
            </div>

            <div className="table-card-body">
              <div className="table-info">
                <span className="info-icon">👥</span>
                <span className="info-text">Capacity: {table.capacity}</span>
              </div>
              <div className="table-status-badge">
                <span className={`badge-dot ${table.status}`}></span>
                <span className="status-text">{table.status}</span>
              </div>
            </div>

            <div className="table-card-actions">
              {table.status === "available" ? (
                <button
                  className="table-action-btn occupy"
                  onClick={() => updateStatus(table._id, "occupied")}
                >
                  <span>🔒</span> Mark Occupied
                </button>
              ) : (
                <button
                  className="table-action-btn free"
                  onClick={() => updateStatus(table._id, "available")}
                >
                  <span>✓</span> Mark Available
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🪑</span>
          <p>No tables found for the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default TableAllocation;
