const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, orderNotes, paymentMethod } = req.body;

    // Validate items array
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.postalCode ||
      !deliveryAddress.phone
    ) {
      return res
        .status(400)
        .json({ message: "Complete delivery address is required" });
    }

    // Process order items and calculate total
    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        return res
          .status(404)
          .json({ message: `Menu item not found: ${item.menuItem}` });
      }

      if (!menuItem.isAvailable) {
        return res
          .status(400)
          .json({ message: `${menuItem.name} is currently unavailable` });
      }

      const subtotal = menuItem.price * item.quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal: subtotal,
      });

      totalAmount += subtotal;
    }

    // Calculate estimated delivery time (45 minutes from now)
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      orderNotes,
      paymentMethod: paymentMethod || "cash",
      estimatedDeliveryTime,
    });

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.menuItem", "name imageUrl");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (admin) or user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};

    // If not admin, only show user's own orders
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    // Filter by status if provided
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.menuItem", "name imageUrl")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.menuItem", "name description imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;

    // Set delivery timestamp if status is delivered
    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    // Set cancellation timestamp if status is cancelled
    if (orderStatus === "cancelled") {
      order.cancelledAt = new Date();
      if (req.body.cancellationReason) {
        order.cancellationReason = req.body.cancellationReason;
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.menuItem", "name imageUrl");

    // Emit socket event for real-time update
    const io = req.app.get("socketio");
    if (io) {
      io.emit("orderStatusUpdated", {
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        orderStatus: updatedOrder.orderStatus,
        userId: updatedOrder.user._id,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.menuItem", "name imageUrl");

    // Emit socket event for real-time update
    const io = req.app.get("socketio");
    if (io) {
      io.emit("paymentStatusUpdated", {
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        paymentStatus: updatedOrder.paymentStatus,
        userId: updatedOrder.user._id,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized to cancel this order
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Only allow cancellation if order is not already delivered or cancelled
    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res
        .status(400)
        .json({ message: `Cannot cancel ${order.orderStatus} order` });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || "Cancelled by user";

    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });
    const completedOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: "delivered", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
};
