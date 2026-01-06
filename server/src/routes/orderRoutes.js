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
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Get order statistics (admin, manager, owner)
router.get("/stats", authorize('admin', 'manager', 'owner'), getOrderStats);

// Create new order and get all orders
router.route("/").post(createOrder).get(getOrders);

// Get, update, cancel specific order
router.route("/:id").get(getOrderById).delete(cancelOrder);

// Update order status (waiter, chef, admin, manager, owner)
router.put("/:id/status", authorize('admin', 'manager', 'owner', 'chef', 'waiter'), updateOrderStatus);

// Update payment status (cashier, admin, manager, owner)
router.put("/:id/payment", authorize('admin', 'manager', 'owner', 'cashier'), updatePaymentStatus);

module.exports = router;
