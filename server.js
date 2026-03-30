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
//     console.log("⚠️ Running without MongoDB - using mock data");
//   });

// // ============= BASIC ROUTES =============

// // 1. Health Check
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
//       "GET    /api/health",
//       "GET    /api/test",
//       "POST   /api/auth/login",
//       "POST   /api/auth/register",
//       "GET    /api/auth/me",
//       "GET    /api/orders",
//       "POST   /api/orders",
//       "POST   /api/admin/login",
//     ],
//   });
// });

// // 3. Test Route
// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Test endpoint is working perfectly!",
//   });
// });

// // ============= LOAD ROUTES =============

// // Create basic routes if route files don't exist

// // Try to load existing routes, fallback to basic routes
// try {
//   // Try to load auth routes
//   try {
//     app.use("/api/auth", require("./routes/auth"));
//     console.log("✅ Auth routes loaded from file");
//   } catch {
//     console.log("⚠️ Auth route file not found, using basic routes");
//     createBasicRoutes();
//   }

//   // Try to load order routes
//   try {
//     app.use("/api/orders", require("./routes/order"));
//     console.log("✅ Order routes loaded from file");
//   } catch {
//     console.log("⚠️ Order route file not found");
//   }

//   // Try to load admin routes
//   try {
//     app.use("/api/admin", require("./routes/admin"));
//     console.log("✅ Admin routes loaded from file");
//   } catch {
//     console.log("⚠️ Admin route file not found");
//   }

//   // Try to load settings routes
//   try {
//     app.use("/api/settings", require("./routes/settings"));
//     console.log("✅ Settings routes loaded from file");
//   } catch {
//     console.log("⚠️ Settings route file not found");
//   }
// } catch (error) {
//   console.log("❌ Error loading routes:", error.message);
//   createBasicRoutes();
// }

// // ============= 404 HANDLER =============
// // FIX: Use proper catch-all route
// app.use((req, res, next) => {
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
//   });
// });

// // ============= ERROR HANDLER =============
// app.use((err, req, res, next) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     error: "Internal server error",
//     message: err.message,
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
// ========================================

// 📋 Test these URLs immediately:
//    ✅ http://localhost:${PORT}/api/health
//    ✅ http://localhost:${PORT}/api/test
//    ✅ http://localhost:${PORT}/

// 🔐 Login Credentials:
//    User: user@example.com / admin123
//    Admin: admin / admin123
//   `);
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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

// Try to load existing routes, fallback to basic routes
try {
  try {
    app.use("/api/auth", require("./routes/auth"));
    console.log("✅ Auth routes loaded from file");
  } catch {
    console.log("⚠️ Auth route file not found, using basic routes");
  }

  try {
    app.use("/api/orders", require("./routes/order"));
    console.log("✅ Order routes loaded from file");
  } catch {
    console.log("⚠️ Order route file not found");
  }

  try {
    app.use("/api/admin", require("./routes/admin"));
    console.log("✅ Admin routes loaded from file");
  } catch {
    console.log("⚠️ Admin route file not found");
  }

  try {
    app.use("/api/settings", require("./routes/settings"));
    console.log("✅ Settings routes loaded from file");
  } catch {
    console.log("⚠️ Settings route file not found");
  }
} catch (error) {
  console.log("❌ Error loading routes:", error.message);
}

// ============= SERVE FRONTEND (React App) =============

// Determine frontend build path
const frontendBuildPath = path.join(__dirname, "dist"); // or 'build' if your build folder is named 'build'

// Check if frontend build exists and serve it
if (fs.existsSync(frontendBuildPath)) {
  console.log(`✅ Frontend build found at: ${frontendBuildPath}`);

  // Serve static files (CSS, JS, images, etc.)
  app.use(express.static(frontendBuildPath));

  // Catch-all route for React Router - MUST be after all API routes
  app.get("*", (req, res) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    // Send index.html for all other routes
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  console.log(`⚠️ Frontend build not found at: ${frontendBuildPath}`);
  console.log("Please build your React app first: npm run build");
  console.log("Or update the frontendBuildPath to point to your build folder");
}

// ============= 404 HANDLER (Only for API routes that weren't matched) =============
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({
      error: "API route not found",
      requested: `${req.method} ${req.originalUrl}`,
    });
  } else {
    // If we get here and frontend exists, send index.html
    if (fs.existsSync(frontendBuildPath)) {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
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
🔗 Frontend: http://localhost:5173 (if running separately)
   or http://localhost:${PORT} (if frontend is served from backend)
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
