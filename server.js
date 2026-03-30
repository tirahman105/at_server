// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");

// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Connect to MongoDB
// // mongoose
// //   .connect(process.env.MONGODB_URI)
// //   .then(() => console.log("MongoDB connected to Anonnota DB"))
// //   .catch((err) => console.error("MongoDB connection error:", err));

// // // Routes
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/orders", require("./routes/order"));
// // app.use("/api/admin", require("./routes/admin"));
// // app.use("/api/settings", require("./routes/settings"));

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/anonnota")
//   .then(() => console.log("✅ MongoDB connected to Anonnota DB"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     console.log("⚠️ Running without MongoDB");
//   });

// // ============= BASIC ROUTES (সবচেয়ে উপরে) =============

// // 1. Health Check - MUST BE FIRST
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     message: "AnonnoTa Server is running!",
//     timestamp: new Date().toISOString(),
//     version: "1.0.0",
//   });
// });

// // 2. Root Route
// app.get("/", (req, res) => {
//   res.json({
//     message: "🎉 Welcome to AnonnoTa Backend API",
//     endpoints: [
//       "GET    /api/health               - Health check",
//       "POST   /api/auth/login          - User login",
//       "POST   /api/auth/register       - User registration",
//       "GET    /api/auth/me             - Get user profile",
//       "GET    /api/orders              - Get user orders",
//       "POST   /api/orders              - Create order",
//       "POST   /api/admin/login         - Admin login",
//       "GET    /api/admin/orders        - Admin: all orders",
//       "GET    /api/admin/users         - Admin: all users",
//     ],
//     documentation: "Check server console for more details",
//   });
// });

// // 3. Test Route
// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Test endpoint is working perfectly!",
//     data: { test: "passed" },
//   });
// });

// // ============= LOAD ROUTES =============

// // Try to load routes, but don't crash if files don't exist
// try {
//   app.use("/api/auth", require("./routes/auth"));
//   console.log("✅ Auth routes loaded");
// } catch (error) {
//   console.log("⚠️ Auth routes not loaded:", error.message);
// }

// try {
//   app.use("/api/orders", require("./routes/order"));
//   console.log("✅ Order routes loaded");
// } catch (error) {
//   console.log("⚠️ Order routes not loaded:", error.message);
// }

// try {
//   app.use("/api/admin", require("./routes/admin"));
//   console.log("✅ Admin routes loaded");
// } catch (error) {
//   console.log("⚠️ Admin routes not loaded:", error.message);
// }

// try {
//   app.use("/api/settings", require("./routes/settings"));
//   console.log("✅ Settings routes loaded");
// } catch (error) {
//   console.log("⚠️ Settings routes not loaded:", error.message);
// }

// // ============= FALLBACK ROUTES =============

// // Fallback for missing routes
// app.use("*", (req, res) => {
//   res.status(404).json({
//     error: "Route not found",
//     requested: `${req.method} ${req.originalUrl}`,
//     available: [
//       "GET    /api/health",
//       "GET    /",
//       "GET    /api/test",
//       "POST   /api/auth/login",
//       "GET    /api/auth/me",
//       "GET    /api/orders",
//       "POST   /api/orders",
//       "POST   /api/admin/login",
//     ],
//     tip: "Check server console for loaded routes",
//   });
// });

// // ============= START SERVER =============

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`
// 🚀 ========================================
//    AnonnoTa Backend Server Started!
// 📡 Port: ${PORT}
// 🌐 Health: http://localhost:${PORT}/api/health
// 🔗 Frontend: http://localhost:5173
// 📚 API Docs: http://localhost:${PORT}/
// ========================================

// 📋 Available Endpoints:
//    GET    http://localhost:${PORT}/api/health
//    GET    http://localhost:${PORT}/api/test
//    POST   http://localhost:${PORT}/api/auth/login
//    GET    http://localhost:${PORT}/api/auth/me
//    GET    http://localhost:${PORT}/api/orders
//    POST   http://localhost:${PORT}/api/orders
//    POST   http://localhost:${PORT}/api/admin/login

// 💡 Test immediately in browser:
//    Open: http://localhost:${PORT}/api/health
//   `);
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/anonnota")
  .then(() => console.log("✅ MongoDB connected to Anonnota DB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("⚠️ Running without MongoDB - using mock data");
  });

// ============= BASIC ROUTES =============

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AnonnoTa Server is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 2. Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Welcome to AnonnoTa Backend API",
    endpoints: [
      "GET    /api/health",
      "GET    /api/test",
      "POST   /api/auth/login",
      "POST   /api/auth/register",
      "GET    /api/auth/me",
      "GET    /api/orders",
      "POST   /api/orders",
      "POST   /api/admin/login",
    ],
  });
});

// 3. Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test endpoint is working perfectly!",
  });
});

// ============= LOAD ROUTES =============

// Create basic routes if route files don't exist

// Try to load existing routes, fallback to basic routes
try {
  // Try to load auth routes
  try {
    app.use("/api/auth", require("./routes/auth"));
    console.log("✅ Auth routes loaded from file");
  } catch {
    console.log("⚠️ Auth route file not found, using basic routes");
    createBasicRoutes();
  }

  // Try to load order routes
  try {
    app.use("/api/orders", require("./routes/order"));
    console.log("✅ Order routes loaded from file");
  } catch {
    console.log("⚠️ Order route file not found");
  }

  // Try to load admin routes
  try {
    app.use("/api/admin", require("./routes/admin"));
    console.log("✅ Admin routes loaded from file");
  } catch {
    console.log("⚠️ Admin route file not found");
  }

  // Try to load settings routes
  try {
    app.use("/api/settings", require("./routes/settings"));
    console.log("✅ Settings routes loaded from file");
  } catch {
    console.log("⚠️ Settings route file not found");
  }
} catch (error) {
  console.log("❌ Error loading routes:", error.message);
  createBasicRoutes();
}

// ============= 404 HANDLER =============
// FIX: Use proper catch-all route
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    requested: `${req.method} ${req.originalUrl}`,
    available: [
      "GET    /api/health",
      "GET    /",
      "GET    /api/test",
      "POST   /api/auth/login",
      "GET    /api/auth/me",
      "GET    /api/orders",
      "POST   /api/orders",
      "POST   /api/admin/login",
    ],
  });
});

// ============= ERROR HANDLER =============
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ============= START SERVER =============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🚀 ========================================
   AnonnoTa Backend Server Started!
📡 Port: ${PORT}
🌐 Health: http://localhost:${PORT}/api/health
🔗 Frontend: http://localhost:5173
========================================

📋 Test these URLs immediately:
   ✅ http://localhost:${PORT}/api/health
   ✅ http://localhost:${PORT}/api/test
   ✅ http://localhost:${PORT}/

🔐 Login Credentials:
   User: user@example.com / admin123
   Admin: admin / admin123
  `);
});
