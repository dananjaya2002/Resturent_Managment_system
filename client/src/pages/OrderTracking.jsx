import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OrderTracking.css";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order details");
      console.error("Fetch order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          reason: "Customer requested cancellation",
        },
      });

      alert("Order cancelled successfully");
      fetchOrder(); // Refresh order data
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusSteps = () => {
    const allSteps = [
      { key: "pending", label: "Order Placed" },
      { key: "confirmed", label: "Confirmed" },
      { key: "preparing", label: "Preparing" },
      { key: "ready", label: "Ready" },
      { key: "out-for-delivery", label: "Out for Delivery" },
      { key: "delivered", label: "Delivered" },
    ];

    if (order.orderStatus === "cancelled") {
      return [{ key: "cancelled", label: "Cancelled" }];
    }

    const currentIndex = allSteps.findIndex(
      (step) => step.key === order.orderStatus
    );
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="order-tracking-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/orders")}>Back to Orders</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-container">
        <div className="error-message">Order not found</div>
        <button onClick={() => navigate("/orders")}>Back to Orders</button>
      </div>
    );
  }

  const canCancel =
    order.orderStatus !== "delivered" &&
    order.orderStatus !== "cancelled" &&
    order.orderStatus !== "out-for-delivery";

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <button onClick={() => navigate("/orders")} className="back-btn">
          ← Back to Orders
        </button>
        <h1>Order #{order.orderNumber}</h1>
        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
      </div>

      {/* Order Status Progress */}
      <div className="order-progress">
        <h2>Order Status</h2>
        <div className="progress-steps">
          {getStatusSteps().map((step, index) => (
            <div
              key={step.key}
              className={`progress-step ${step.completed ? "completed" : ""} ${
                step.active ? "active" : ""
              }`}
            >
              <div className="step-circle">
                {step.completed ? "✓" : index + 1}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-details-grid">
        {/* Order Items */}
        <div className="order-section">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="tracking-item">
                <div className="tracking-item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                </div>
                <div className="tracking-item-subtotal">
                  ${item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-total-section">
            <span>Total Amount:</span>
            <span className="total-amount">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="order-section">
          <h2>Delivery Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">
                {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.postalCode}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{order.deliveryAddress.phone}</span>
            </div>
            {order.deliveryAddress.notes && (
              <div className="info-item">
                <span className="info-label">Delivery Notes:</span>
                <span className="info-value">
                  {order.deliveryAddress.notes}
                </span>
              </div>
            )}
            {order.orderNotes && (
              <div className="info-item">
                <span className="info-label">Order Notes:</span>
                <span className="info-value">{order.orderNotes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="order-section">
          <h2>Payment Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Payment Method:</span>
              <span className="info-value payment-method">
                {order.paymentMethod === "cash"
                  ? "Cash on Delivery"
                  : order.paymentMethod === "card"
                  ? "Card on Delivery"
                  : "Online Payment"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Status:</span>
              <span className={`payment-status status-${order.paymentStatus}`}>
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDeliveryTime && order.orderStatus !== "delivered" && (
          <div className="order-section">
            <h2>Estimated Delivery</h2>
            <p className="estimated-time">
              {formatDate(order.estimatedDeliveryTime)}
            </p>
          </div>
        )}

        {/* Delivered At */}
        {order.deliveredAt && (
          <div className="order-section">
            <h2>Delivered At</h2>
            <p className="estimated-time">{formatDate(order.deliveredAt)}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {canCancel && (
        <div className="order-actions">
          <button onClick={handleCancelOrder} className="cancel-order-btn">
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
