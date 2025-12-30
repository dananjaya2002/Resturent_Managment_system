const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// CORS configuration - allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://resturent-managment-system-nu.vercel.app'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Serve static files for images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant Ordering System API is running...");
});

// Error Handling Middleware
app.use((err, req, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
