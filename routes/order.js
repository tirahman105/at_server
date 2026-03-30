// // routes/order.js
// const express = require("express");
// const router = express.Router();
// const verifyToken = require("../middleware/auth");
// const Order = require("../models/Order");
// const User = require("../models/User");
// const Settings = require("../models/Settings");
// const { sendStatusUpdateNotification } = require("../utils/telegramBot");

// // ✅ Create New Order
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     console.log("📝 Creating new order for user:", req.user.id);
//     console.log("📦 Order data:", req.body);

//     const {
//       dollarAmount,
//       boostingType,
//       facebookPostLink,
//       paymentBkashNumber,
//       paymentAmount,
//       note,
//     } = req.body;

//     // ✅ Validation
//     if (
//       !dollarAmount ||
//       !boostingType ||
//       !facebookPostLink ||
//       !paymentBkashNumber ||
//       !paymentAmount
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "সব প্রয়োজনীয় ফিল্ড পূরণ করুন",
//         missing: {
//           dollarAmount: !dollarAmount,
//           boostingType: !boostingType,
//           facebookPostLink: !facebookPostLink,
//           paymentBkashNumber: !paymentBkashNumber,
//           paymentAmount: !paymentAmount,
//         },
//       });
//     }

//     // Convert to numbers
//     const dollarAmountNum = parseFloat(dollarAmount);
//     const paymentAmountNum = parseFloat(paymentAmount);

//     if (isNaN(dollarAmountNum) || dollarAmountNum < 4) {
//       return res.status(400).json({
//         success: false,
//         message: "ন্যূনতম ৪ ডলার প্রয়োজন",
//       });
//     }

//     // Additional validation for Ad Campaign
//     if (boostingType === "Ad Campaign" && dollarAmountNum < 10) {
//       return res.status(400).json({
//         success: false,
//         message: "এড ক্যাম্পেইনের জন্য ন্যূনতম ১০ ডলার প্রয়োজন",
//       });
//     }

//     // Get dollar rate from settings or use default
//     const settings = await Settings.findOne();
//     const dollarRate = settings?.dollarRate || 162;
//     const profitPerDollar = 30; // প্রতি ডলারে 30 টাকা লাভ

//     // ✅ MANUAL CALCULATION (since pre-save middleware removed)
//     const takaAmount = dollarAmountNum * dollarRate;
//     const totalProfit = dollarAmountNum * profitPerDollar;
//     const mainCosting = takaAmount - totalProfit;

//     // Verify payment amount matches calculated amount
//     // Allow small rounding differences (1 taka)

//     // Generate unique order ID
//     const orderId = `AT${Math.floor(1000 + Math.random() * 9000)}`;

//     // Create new order with ALL calculated fields
//     const orderData = {
//       orderId,
//       userId: req.user.id,
//       dollarAmount: dollarAmountNum,
//       takaAmount, // Calculated
//       dollarRate,
//       profitPerDollar,
//       totalProfit, // Calculated
//       mainCosting, // Calculated
//       boostingType,
//       facebookPostLink,
//       paymentBkashNumber,
//       paymentAmount: paymentAmountNum,
//       paymentVerified: false,
//       note: note || "",
//       orderStatus: "Pending",
//       withdrawStatus: "Not Yet",
//       cardLoad: "Not Yet",
//       remarks: "",
//       // createdAt and updatedAt will be auto-added by timestamps: true
//     };

//     console.log("📋 Final order data to save:", orderData);

//     const order = new Order(orderData);
//     const savedOrder = await order.save();

//     console.log("✅ Order saved to database:", savedOrder._id);

//     // Update user statistics
//     try {
//       await User.findByIdAndUpdate(
//         req.user.id,
//         {
//           $inc: {
//             totalOrders: 1,
//             totalSpentDollar: dollarAmountNum,
//             totalSpentTaka: takaAmount,
//           },
//         },
//         { new: true },
//       );
//       console.log("✅ User stats updated");
//     } catch (userError) {
//       console.error("⚠️ User stats update failed:", userError.message);
//       // Continue even if user update fails
//     }

//     console.log("✅ Order created successfully:", orderId);

//     res.status(201).json({
//       success: true,
//       message: "অর্ডার সফলভাবে তৈরি হয়েছে!",
//       order: {
//         _id: savedOrder._id,
//         orderId: savedOrder.orderId,
//         dollarAmount: savedOrder.dollarAmount,
//         takaAmount: savedOrder.takaAmount,
//         boostingType: savedOrder.boostingType,
//         orderStatus: savedOrder.orderStatus,
//         createdAt: savedOrder.createdAt,
//         paymentBkashNumber: savedOrder.paymentBkashNumber,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     console.error("❌ Error stack:", error.stack);

//     res.status(500).json({
//       success: false,
//       message: "অর্ডার তৈরি করতে সমস্যা হয়েছে",
//       error: error.message,
//     });
//   }
// });

// // ✅ Get User Orders
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user.id })
//       .sort({ createdAt: -1 })
//       .select("-profitPerDollar -totalProfit -mainCosting"); // Hide profit fields from user

//     res.json({
//       success: true,
//       orders,
//       count: orders.length,
//     });
//   } catch (error) {
//     console.error("❌ Get orders error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // ✅ Get Order by ID
// router.get("/:id", verifyToken, async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "অর্ডার খুঁজে পাওয়া যায়নি",
//       });
//     }

//     res.json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("❌ Get order error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // ✅ Get Order Stats for User
// router.get("/stats", verifyToken, async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments({ userId: req.user.id });

//     const revenueAgg = await Order.aggregate([
//       { $match: { userId: req.user._id } },
//       { $group: { _id: null, total: { $sum: "$takaAmount" } } },
//     ]);

//     const totalSpent = revenueAgg[0]?.total || 0;
//     const pendingOrders = await Order.countDocuments({
//       userId: req.user.id,
//       orderStatus: "Pending",
//     });

//     res.json({
//       success: true,
//       stats: {
//         totalOrders,
//         totalSpent,
//         pendingOrders,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // Update single order status রাউটে যোগ করুন
// router.put("/orders/:id", verifyToken, checkAdmin, async (req, res) => {
//   try {
//     console.log(`📝 Updating order ${req.params.id}:`, req.body);

//     const { orderStatus, withdrawStatus, cardLoad, remarks, remainingBalance } =
//       req.body;

//     const updateData = {};

//     if (orderStatus) updateData.orderStatus = orderStatus;
//     if (withdrawStatus) updateData.withdrawStatus = withdrawStatus;
//     if (cardLoad) updateData.cardLoad = cardLoad;
//     if (remarks !== undefined) updateData.remarks = remarks;
//     updateData.updatedAt = new Date();

//     // Get old order first to compare status
//     const oldOrder = await Order.findById(req.params.id);

//     const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     }).populate("userId", "name email mobile");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // যদি remainingBalance দেয়া থাকে, user এর balance update করুন
//     if (remainingBalance && remainingBalance > 0) {
//       await User.findByIdAndUpdate(order.userId._id, {
//         $inc: { remainingBalance: remainingBalance },
//       });
//     }

//     // ✅ Send Telegram notification if status changed
//     if (orderStatus && oldOrder.orderStatus !== orderStatus) {
//       try {
//         await sendStatusUpdateNotification(
//           order,
//           oldOrder.orderStatus,
//           orderStatus,
//         );
//         console.log("📱 Status update Telegram notification sent");
//       } catch (telegramError) {
//         console.error("Telegram notification error:", telegramError);
//       }
//     }

//     res.json({
//       message: "Order updated successfully",
//       order: order,
//     });
//   } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Test endpoint - For debugging
// router.get("/test/create", verifyToken, async (req, res) => {
//   try {
//     // Create a test order without going through the full process
//     const orderId = `TEST${Date.now()}`;
//     const testOrder = new Order({
//       orderId,
//       userId: req.user.id,
//       dollarAmount: 5,
//       takaAmount: 810,
//       dollarRate: 162,
//       profitPerDollar: 30,
//       totalProfit: 150,
//       mainCosting: 660,
//       boostingType: "Message Campaign",
//       facebookPostLink: "https://facebook.com/test",
//       paymentBkashNumber: "01712345678",
//       paymentAmount: 810,
//       note: "Test order",
//     });

//     await testOrder.save();

//     res.json({
//       success: true,
//       message: "Test order created",
//       order: testOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// module.exports = router;

// routes/order.js - FINAL COMPLETE VERSION
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Settings = require("../models/Settings");
const mongoose = require("mongoose");
const { sendOrderNotification } = require("../utils/telegramBot");
// ============= USER ORDER ROUTES =============

// ✅ 1. Get User's Orders
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("📞 /api/orders called for user:", req.user.id);

    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-profitPerDollar -totalProfit -mainCosting"); // Hide profit fields from user

    console.log(`✅ Found ${orders.length} orders for user ${req.user.id}`);

    // Send success response
    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders, // ✅ "data" field-এ orders রাখুন
      count: orders.length,
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
});

// ✅ 2. Create New Order
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("📝 Creating new order for user:", req.user.id);
    console.log("📦 Order data:", req.body);

    const {
      dollarAmount,
      boostingType, // This will be the sub type from frontend
      serviceCategory, // NEW: "Boosting", "Ad Campaign", or "Promotion"
      serviceSubType, // NEW: The selected sub type
      facebookPostLink,
      paymentBkashNumber,
      paymentAmount,
      note,
    } = req.body;

    // ✅ Validation
    if (
      !dollarAmount ||
      !boostingType ||
      !facebookPostLink ||
      !paymentBkashNumber ||
      !paymentAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "সব প্রয়োজনীয় ফিল্ড পূরণ করুন",
      });
    }

    // ✅ NEW: Validate service category
    if (!serviceCategory) {
      return res.status(400).json({
        success: false,
        message: "সার্ভিস ক্যাটাগরি নির্বাচন করুন",
      });
    }

    // Convert to numbers
    const dollarAmountNum = parseFloat(dollarAmount);
    const paymentAmountNum = parseFloat(paymentAmount);

    if (isNaN(dollarAmountNum) || dollarAmountNum < 4) {
      return res.status(400).json({
        success: false,
        message: "ন্যূনতম ৪ ডলার প্রয়োজন",
      });
    }

    // Get dollar rate from settings or use default
    const settings = await Settings.findOne();
    const dollarRate = settings?.dollarRate || 162;
    const profitPerDollar = 30;

    // Calculate amounts
    const takaAmount = dollarAmountNum * dollarRate;
    const totalProfit = dollarAmountNum * profitPerDollar;
    const mainCosting = takaAmount - totalProfit;

    // Generate unique order ID
    const orderId = `AT${Math.floor(1000 + Math.random() * 9000)}`;

    // Create new order
    const orderData = {
      orderId,
      userId: req.user.id,
      dollarAmount: dollarAmountNum,
      takaAmount,
      dollarRate,
      profitPerDollar,
      totalProfit,
      mainCosting,
      serviceCategory: serviceCategory, // ✅ NEW
      serviceSubType: serviceSubType || boostingType, // ✅ NEW
      boostingType: boostingType, // Keep for compatibility
      facebookPostLink,
      paymentBkashNumber,
      paymentAmount: paymentAmountNum,
      paymentVerified: false,
      note: note || "",
      orderStatus: "Pending",
      withdrawStatus: "Not Yet",
      cardLoad: "Not Yet",
      remarks: "",
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    /////////////////////telegram starts here//////////////////

    // ✅ Telegram notification পাঠান
    try {
      // Get user details
      const user = await User.findById(req.user.id).select("name email mobile");

      // Send notification
      await sendOrderNotification(savedOrder, user);
      console.log("✅ Telegram notification sent");
    } catch (telegramError) {
      console.error("⚠️ Telegram notification failed:", telegramError.message);
      // Continue even if Telegram fails
    }

    ///////////////////////////////////////////////////////

    console.log("✅ Order saved to database:", savedOrder._id);

    // Update user statistics
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            totalOrders: 1,
            totalSpentDollar: dollarAmountNum,
            totalSpentTaka: takaAmount,
          },
        },
        { new: true },
      );
      console.log("✅ User stats updated");
    } catch (userError) {
      console.error("⚠️ User stats update failed:", userError.message);
    }

    console.log("✅ Order created successfully:", orderId);

    res.status(201).json({
      success: true,
      message: "অর্ডার সফলভাবে তৈরি হয়েছে!",
      order: {
        _id: savedOrder._id,
        orderId: savedOrder.orderId,
        dollarAmount: savedOrder.dollarAmount,
        takaAmount: savedOrder.takaAmount,
        boostingType: savedOrder.boostingType,
        orderStatus: savedOrder.orderStatus,
        createdAt: savedOrder.createdAt,
        paymentBkashNumber: savedOrder.paymentBkashNumber,
      },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("❌ Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "অর্ডার তৈরি করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
});

// ✅ 3. Get Single Order by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(`📝 Getting order ${orderId} for user ${req.user.id}`);

    let order;

    // Try by MongoDB _id first
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findOne({
        _id: orderId,
        userId: req.user.id,
      });
    }

    // If not found by _id, try by orderId
    if (!order) {
      order = await Order.findOne({
        orderId: orderId,
        userId: req.user.id,
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "অর্ডার খুঁজে পাওয়া যায়নি",
      });
    }

    res.json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("❌ Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ 4. Get Order Stats for User
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalOrders = await Order.countDocuments({ userId: userId });

    const revenueAgg = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$takaAmount" } } },
    ]);

    const totalSpent = revenueAgg[0]?.total || 0;
    const pendingOrders = await Order.countDocuments({
      userId: userId,
      orderStatus: "Pending",
    });

    const completedOrders = await Order.countDocuments({
      userId: userId,
      orderStatus: "Completed",
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalSpent,
        pendingOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ 5. Test endpoint - For debugging
router.get("/test/debug", verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "User order endpoint is working",
      user: req.user,
      timestamp: new Date(),
      endpoints: {
        "GET /": "Get all user orders",
        "POST /": "Create new order",
        "GET /:id": "Get single order",
        "GET /stats/summary": "Get order statistics",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
