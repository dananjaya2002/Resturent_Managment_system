const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    orderType: {
      type: String,
      enum: ["delivery", "dine-in", "takeaway"],
      default: "delivery",
    },
    tableNumber: {
      type: Number,
      required: function () {
        return this.orderType === "dine-in";
      },
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },
    deliveryAddress: {
      street: {
        type: String,
        required: function () {
          return this.orderType === "delivery";
        },
        maxlength: [200, "Street address cannot exceed 200 characters"],
      },
      city: {
        type: String,
        required: function () {
          return this.orderType === "delivery";
        },
        maxlength: [50, "City name cannot exceed 50 characters"],
      },
      postalCode: {
        type: String,
        required: function () {
          return this.orderType === "delivery";
        },
        match: [/^[0-9]{5,10}$/, "Please enter a valid postal code"],
      },
      phone: {
        type: String,
        required: function () {
          return this.orderType === "delivery";
        },
        match: [/^[\d\s\-\+\(\)]{10,15}$/, "Please enter a valid phone number"],
      },
      notes: {
        type: String,
        maxlength: [500, "Notes cannot exceed 500 characters"],
      },
    },
    orderNotes: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ table: 1, orderStatus: 1 });
orderSchema.index({ tableNumber: 1, orderType: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
