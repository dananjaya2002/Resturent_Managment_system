import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OrderHistory.css";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url =
        filter === "all"
          ? "http://localhost:5000/api/orders"
          : `http://localhost:5000/api/orders?status=${filter}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffa500",
      confirmed: "#4caf50",
      preparing: "#2196f3",
      ready: "#9c27b0",
      "out-for-delivery": "#ff9800",
      delivered: "#4caf50",
      cancelled: "#f44336",
    };
    return colors[status] || "#666";
  };

  const getStatusLabel = (status) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>

      {/* Filter Tabs */}
      <div className="order-filters">
        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          All Orders
        </button>
        <button
          className={filter === "pending" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={
            filter === "confirmed" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={
            filter === "delivered" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setFilter("delivered")}
        >
          Delivered
        </button>
        <button
          className={
            filter === "cancelled" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
          <button onClick={() => navigate("/menu")}>Browse Menu</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                >
                  {getStatusLabel(order.orderStatus)}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="item-price">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
