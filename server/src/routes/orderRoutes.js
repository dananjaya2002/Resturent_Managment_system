const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Get order statistics (admin only) - must be before /:id route
router.get("/stats", admin, getOrderStats);

// Create new order and get all orders
router.route("/").post(createOrder).get(getOrders);

// Get, update, cancel specific order
router.route("/:id").get(getOrderById).delete(cancelOrder);

// Update order status (admin only)
router.put("/:id/status", admin, updateOrderStatus);

// Update payment status (admin only)
router.put("/:id/payment", admin, updatePaymentStatus);

module.exports = router;
