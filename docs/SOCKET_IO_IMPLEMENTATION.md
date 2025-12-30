# Socket.IO Real-Time Communication Implementation

## Overview

This document explains how Socket.IO is implemented in the Restaurant Management System to provide real-time order status updates between administrators and customers.

## Architecture

### Backend (Server)

**Location:** `server/src/server.js`

#### Socket.IO Server Setup

```javascript
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);

// Socket.IO Setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Connection event handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("socketio", io);
```

**Key Points:**

- Creates HTTP server wrapping Express app
- Configures CORS to allow frontend origin
- Stores Socket.IO instance in Express app for access in controllers
- Logs connections/disconnections for debugging

#### Event Emissions

**Location:** `server/src/controllers/orderController.js`

##### Order Status Update Event

```javascript
const updateOrderStatus = async (req, res) => {
  // ... update order status logic ...

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
};
```

##### Payment Status Update Event

```javascript
const updatePaymentStatus = async (req, res) => {
  // ... update payment status logic ...

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
};
```

**Event Payload Structure:**

- `orderId`: MongoDB ObjectId of the order
- `orderNumber`: Human-readable order number (e.g., "ORD1735567890123")
- `orderStatus` or `paymentStatus`: New status value
- `userId`: ID of the customer who owns the order

**Event Broadcasting:**

- Uses `io.emit()` for global broadcast to all connected clients
- Alternative could be `io.to(userId).emit()` for user-specific rooms

---

### Frontend (Client)

#### Socket Context Provider

**Location:** `client/src/context/SocketContext.jsx`

```javascript
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

**Configuration Options:**

- `transports`: Tries WebSocket first, falls back to polling
- `reconnection`: Automatically reconnects on disconnect
- `reconnectionDelay`: Wait 1 second between reconnection attempts
- `reconnectionAttempts`: Try up to 5 times before giving up

**State Management:**

- `socket`: Socket.IO client instance
- `connected`: Boolean indicating connection status

#### Application Integration

**Location:** `client/src/App.jsx`

```javascript
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>{/* Routes and components */}</CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
```

**Provider Hierarchy:**

- AuthProvider (outermost) - Provides user authentication
- SocketProvider - Provides socket connection
- CartProvider - Provides cart functionality

---

## Component Integration

### Order Tracking Page

**Location:** `client/src/pages/OrderTracking.jsx`

#### Socket Event Listeners

```javascript
const OrderTracking = () => {
  const { socket } = useSocket();
  const [order, setOrder] = useState(null);
  const [notification, setNotification] = useState("");

  // Listen for real-time order status updates
  useEffect(() => {
    if (!socket || !order) return;

    const handleOrderStatusUpdate = (data) => {
      // Only update if it's this specific order
      if (data.orderId === orderId) {
        setNotification(
          `Order status updated to: ${data.orderStatus
            .toUpperCase()
            .replace("-", " ")}`
        );
        setTimeout(() => setNotification(""), 5000);
        fetchOrder(); // Refresh order data
      }
    };

    const handlePaymentStatusUpdate = (data) => {
      if (data.orderId === orderId) {
        setNotification(
          `Payment status updated to: ${data.paymentStatus.toUpperCase()}`
        );
        setTimeout(() => setNotification(""), 5000);
        fetchOrder();
      }
    };

    socket.on("orderStatusUpdated", handleOrderStatusUpdate);
    socket.on("paymentStatusUpdated", handlePaymentStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleOrderStatusUpdate);
      socket.off("paymentStatusUpdated", handlePaymentStatusUpdate);
    };
  }, [socket, orderId, order]);

  // ... rest of component
};
```

**Key Features:**

- Checks if socket exists and order is loaded
- Filters events by orderId to only update relevant order
- Shows notification for 5 seconds on update
- Cleans up listeners on unmount or dependency change
- Re-fetches order data to get latest information

#### Notification UI

```javascript
{
  notification && (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#4caf50",
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1000,
        animation: "slideIn 0.3s ease",
      }}
    >
      🔔 {notification}
    </div>
  );
}
```

**Styling:**

- Fixed position in top-right corner
- Green background for success indicator
- High z-index to appear above other content
- Slide-in animation for smooth appearance

---

### Order History Page

**Location:** `client/src/pages/OrderHistory.jsx`

#### Socket Event Listeners

```javascript
const OrderHistory = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState("");

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket || !user) return;

    const handleOrderStatusUpdate = (data) => {
      // Only show notification if it's the current user's order
      if (data.userId === user._id) {
        setNotification(
          `Order #${data.orderNumber} updated to: ${data.orderStatus
            .toUpperCase()
            .replace("-", " ")}`
        );
        setTimeout(() => setNotification(""), 5000);
        fetchOrders(); // Refresh orders list
      }
    };

    const handlePaymentStatusUpdate = (data) => {
      if (data.userId === user._id) {
        setNotification(
          `Payment for Order #${
            data.orderNumber
          } updated to: ${data.paymentStatus.toUpperCase()}`
        );
        setTimeout(() => setNotification(""), 5000);
        fetchOrders();
      }
    };

    socket.on("orderStatusUpdated", handleOrderStatusUpdate);
    socket.on("paymentStatusUpdated", handlePaymentStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleOrderStatusUpdate);
      socket.off("paymentStatusUpdated", handlePaymentStatusUpdate);
    };
  }, [socket, user]);

  // ... rest of component
};
```

**Key Features:**

- Filters updates by userId to only show current user's orders
- Updates entire order list on any relevant change
- Includes order number in notification for clarity
- Independent of which order is currently viewed

---

### Admin Dashboard

**Location:** `client/src/pages/AdminDashboard.jsx`

#### Socket Event Listeners

```javascript
const AdminDashboard = () => {
  const { socket } = useSocket();
  const { user } = useContext(AuthContext);

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket || !user || user.role !== "admin") return;

    const handleOrderStatusUpdate = () => {
      fetchOrders(); // Auto-refresh orders when any order is updated
    };

    const handlePaymentStatusUpdate = () => {
      fetchOrders();
    };

    socket.on("orderStatusUpdated", handleOrderStatusUpdate);
    socket.on("paymentStatusUpdated", handlePaymentStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleOrderStatusUpdate);
      socket.off("paymentStatusUpdated", handleOrderStatusUpdate);
    };
  }, [socket, user]);

  // ... rest of component
};
```

**Key Features:**

- Admin sees ALL order updates (no user filtering)
- Silently refreshes order list without notifications
- Only activates for admin users
- Ensures dashboard always shows current state

---

## Event Flow Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Admin     │         │   Backend    │         │  Customer   │
│  Dashboard  │         │   Server     │         │   Browser   │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │ 1. Update Order       │                        │
       │    Status (PUT)       │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │ 2. Update DB           │
       │                       ├─────────┐              │
       │                       │         │              │
       │                       │<────────┘              │
       │                       │                        │
       │ 3. HTTP Response      │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │                       │ 4. Socket.IO Event     │
       │                       │   (orderStatusUpdated) │
       │                       ├───────────────────────>│
       │ 5. Socket.IO Event    │                        │
       │   (orderStatusUpdated)│                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │ 6. Auto-refresh       │                        │ 7. Show Notification
       │    Orders             │                        │    & Refresh Order
       │                       │                        │
```

**Step-by-Step Flow:**

1. **Admin Action**: Admin clicks status button (e.g., "Confirm Order")
2. **HTTP Request**: Frontend sends PUT request to `/api/orders/:id/status`
3. **Database Update**: Backend updates order in MongoDB
4. **HTTP Response**: Backend returns updated order to admin
5. **Socket Broadcast**: Backend emits `orderStatusUpdated` event to all connected clients
6. **Admin Update**: Admin dashboard receives event and refreshes order list
7. **Customer Notification**: Customer's OrderTracking page receives event, shows notification, and refreshes

---

## Event Types

### orderStatusUpdated

**Triggered When:** Admin changes order status

**Payload:**

```javascript
{
    orderId: "507f1f77bcf86cd799439011",      // MongoDB ObjectId
    orderNumber: "ORD1735567890123",          // Display number
    orderStatus: "preparing",                  // New status
    userId: "507f1f77bcf86cd799439012"        // Customer's user ID
}
```

**Status Values:**

- `pending` - Order just placed
- `confirmed` - Admin confirmed order
- `preparing` - Kitchen is preparing
- `ready` - Ready for pickup/delivery
- `out-for-delivery` - Driver is delivering
- `delivered` - Successfully delivered
- `cancelled` - Order cancelled

### paymentStatusUpdated

**Triggered When:** Admin changes payment status

**Payload:**

```javascript
{
    orderId: "507f1f77bcf86cd799439011",
    orderNumber: "ORD1735567890123",
    paymentStatus: "paid",                     // New status
    userId: "507f1f77bcf86cd799439012"
}
```

**Status Values:**

- `pending` - Payment not received
- `paid` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Testing Socket.IO

### Manual Testing

1. **Setup:**

   - Start backend server: `npm run dev` (in server directory)
   - Start frontend: `npm run dev` (in client directory)
   - Open browser console (F12)

2. **Test Customer View:**

   - Login as customer
   - Place an order
   - Navigate to Order Tracking page
   - Keep page open

3. **Test Admin Action:**

   - Open new browser tab/window
   - Login as admin
   - Go to Admin Dashboard > Orders tab
   - Update the customer's order status

4. **Expected Result:**
   - Customer tab shows notification immediately
   - Order status updates without page refresh
   - Admin dashboard also refreshes automatically

### Browser Console Logging

Check console for these messages:

```
Socket connected: abc123xyz
New client connected: abc123xyz (server-side)
```

On status update:

```
Order status updated to: CONFIRMED
```

### Automated Testing

See `server/src/__tests__/socket.test.js` for Socket.IO unit tests.

---

## Configuration

### Environment Variables

**Backend (.env):**

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend:**
Socket URL is hardcoded in `SocketContext.jsx`:

```javascript
const socketInstance = io("http://localhost:5000", { ... });
```

For production, update to use environment variable:

```javascript
const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:5000", { ... });
```

---

## Performance Considerations

### Connection Management

- Socket connection is created once per session
- Automatically reconnects on network issues
- Disconnects properly on page close/refresh
- Reuses single connection for all events

### Event Filtering

- Client-side filtering prevents unnecessary re-renders
- OrderTracking only reacts to its specific order
- OrderHistory only reacts to current user's orders
- Admin sees all updates (no filtering needed)

### Scalability

**Current Implementation:**

- Broadcasting to all clients (`io.emit()`)
- Works well for small to medium traffic

**Scaling Options:**

1. **Rooms:** Use `socket.join(userId)` and `io.to(userId).emit()`
2. **Redis Adapter:** For multiple server instances
3. **Message Queues:** For high-volume events

---

## Troubleshooting

### Connection Issues

**Problem:** Socket not connecting

**Solutions:**

1. Check backend is running on port 5000
2. Verify CORS configuration in `server.js`
3. Check browser console for connection errors
4. Try clearing browser cache

**Problem:** Events not received

**Solutions:**

1. Verify event names match exactly (case-sensitive)
2. Check socket is connected (`socket.connected`)
3. Ensure listeners are registered before events fire
4. Check event payload structure

### React Warnings

**Problem:** "setState in useEffect" warning

**Solution:** Already handled with proper dependency arrays and cleanup functions

### Multiple Event Listeners

**Problem:** Events firing multiple times

**Solution:** Always clean up listeners in useEffect return function:

```javascript
return () => {
  socket.off("orderStatusUpdated", handleOrderStatusUpdate);
};
```

---

## Security Considerations

### Authentication

**Current State:**

- No socket-level authentication
- Events broadcast to all connected clients
- Client-side filtering by userId

**Recommendations for Production:**

1. **Socket Authentication:**

   ```javascript
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     verifyJWT(token, (err, decoded) => {
       if (err) return next(new Error("Authentication error"));
       socket.userId = decoded.id;
       next();
     });
   });
   ```

2. **User-Specific Rooms:**

   ```javascript
   socket.join(socket.userId);
   io.to(order.userId).emit("orderStatusUpdated", data);
   ```

3. **Rate Limiting:**
   - Implement connection limits
   - Throttle event emissions
   - Monitor for abuse patterns

---

## Future Enhancements

### Potential Features

1. **Typing Indicators:** Show "Admin is updating your order..."
2. **Chat System:** Real-time customer support chat
3. **Kitchen Display:** Live order updates for kitchen staff
4. **Delivery Tracking:** Real-time driver location updates
5. **Order Notifications:** Browser push notifications
6. **Analytics Dashboard:** Real-time order statistics

### Code Improvements

1. **Environment Configuration:** Move socket URL to env variable
2. **Error Recovery:** Better handling of connection failures
3. **Offline Support:** Queue events when offline, sync on reconnect
4. **Event History:** Store recent events for late joiners
5. **Compression:** Enable compression for large payloads

---

## Dependencies

### Backend

```json
{
  "socket.io": "^4.7.2"
}
```

### Frontend

```json
{
  "socket.io-client": "^4.8.1"
}
```

---

## References

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [React Context API](https://react.dev/reference/react/useContext)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

## Conclusion

The Socket.IO implementation provides seamless real-time communication between administrators and customers. When an admin updates an order status, customers see the change instantly without refreshing the page, creating a modern, responsive user experience.

The architecture is designed for maintainability, with clear separation of concerns:

- Backend handles business logic and event emission
- Frontend context manages connection lifecycle
- Components subscribe to relevant events only
- Cleanup prevents memory leaks

This foundation can be extended for additional real-time features as the application grows.
