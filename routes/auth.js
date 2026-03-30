// // const express = require("express");
// // const router = express.Router();
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // const User = require("../models/User");
// // const Admin = require("../models/Admin"); // Admin model import করুন
// // const verifyToken = require("../middleware/auth");

// // // ✅ Login (Updated to check both User and Admin)
// // router.post("/login", async (req, res) => {
// //   try {
// //     console.log("📨 Login request received:", req.body);

// //     const { emailOrMobile, password } = req.body;

// //     if (!emailOrMobile || !password) {
// //       return res.status(400).json({
// //         message: "Email/mobile and password required",
// //       });
// //     }

// //     let user = null;
// //     let userType = "user";

// //     // প্রথমে User collection এ খুঁজুন
// //     user = await User.findOne({
// //       $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
// //     });

// //     // যদি User collection এ না মেলে, Admin collection এ খুঁজুন
// //     if (!user) {
// //       console.log("🔍 Searching in Admin collection...");
// //       user = await Admin.findOne({
// //         $or: [{ username: emailOrMobile }, { email: emailOrMobile }],
// //       });
// //       if (user) {
// //         userType = "admin";
// //         console.log("✅ Admin found:", user.username);
// //       }
// //     }

// //     if (!user) {
// //       console.log("❌ User/Admin not found");
// //       return res.status(400).json({ message: "User not found" });
// //     }

// //     console.log("🔐 Comparing password for:", userType);
// //     const validPassword = await bcrypt.compare(password, user.password);

// //     if (!validPassword) {
// //       console.log("❌ Invalid password");
// //       return res.status(400).json({ message: "Invalid password" });
// //     }

// //     console.log("✅ Password valid, creating token...");

// //     // JWT payload তৈরি করুন
// //     const payload = {
// //       id: user._id,
// //       role: user.role || userType,
// //       userType: userType,
// //     };

// //     // username/email যোগ করুন
// //     if (userType === "admin") {
// //       payload.username = user.username;
// //       payload.email = user.email || user.username;
// //     } else {
// //       payload.email = user.email;
// //       payload.name = user.name;
// //       payload.mobile = user.mobile;
// //     }

// //     const token = jwt.sign(
// //       payload,
// //       process.env.JWT_SECRET || "anonnota_secret_key",
// //       { expiresIn: "7d" },
// //     );

// //     console.log("✅ Login successful for:", user.email || user.username);

// //     // Response তৈরি করুন
// //     const responseData = {
// //       message: "Login successful",
// //       token,
// //       user: {
// //         id: user._id,
// //         role: user.role || userType,
// //       },
// //     };

// //     // userType অনুযায়ী অতিরিক্ত data যোগ করুন
// //     if (userType === "admin") {
// //       responseData.user.username = user.username;
// //       responseData.user.email = user.email || user.username;
// //       responseData.user.name = user.username;
// //     } else {
// //       responseData.user.name = user.name;
// //       responseData.user.email = user.email;
// //       responseData.user.mobile = user.mobile;
// //       responseData.user.remainingBalance = user.remainingBalance;
// //     }

// //     res.json(responseData);
// //   } catch (error) {
// //     console.error("❌ Login error:", error);
// //     res.status(500).json({
// //       message: "Internal server error",
// //       error: error.message,
// //       stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
// //     });
// //   }
// // });
// // // ✅ Get User/Admin Profile (ME endpoint)
// // router.get("/me", verifyToken, async (req, res) => {
// //   try {
// //     let user = null;

// //     // JWT token থেকে userType চেক করুন
// //     if (req.user.userType === "admin") {
// //       // Admin হলে Admin collection থেকে খুঁজুন
// //       user = await Admin.findById(req.user.id).select("-password");
// //     } else {
// //       // User হলে User collection থেকে খুঁজুন
// //       user = await User.findById(req.user.id).select("-password");
// //     }

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Response format তৈরি করুন
// //     const userResponse = {
// //       id: user._id,
// //       role: user.role || req.user.userType || "user",
// //     };

// //     // userType অনুযায়ী অতিরিক্ত ফিল্ড যোগ করুন
// //     if (req.user.userType === "admin") {
// //       userResponse.username = user.username;
// //       userResponse.email = user.email || user.username;
// //       userResponse.name = user.username;
// //       userResponse.isAdmin = true;
// //     } else {
// //       userResponse.name = user.name;
// //       userResponse.email = user.email;
// //       userResponse.mobile = user.mobile;
// //       userResponse.facebookProfile = user.facebookProfile;
// //       userResponse.facebookPage = user.facebookPage;
// //       userResponse.address = user.address;
// //       userResponse.businessType = user.businessType;
// //       userResponse.bKashNumber = user.bKashNumber;
// //       userResponse.remainingBalance = user.remainingBalance;
// //       userResponse.totalOrders = user.totalOrders;
// //       userResponse.totalSpentDollar = user.totalSpentDollar;
// //       userResponse.totalSpentTaka = user.totalSpentTaka;
// //       userResponse.registrationDate = user.registrationDate;
// //       userResponse.isAdmin = false;
// //     }

// //     res.json({
// //       user: userResponse,
// //     });
// //   } catch (error) {
// //     console.error("ME endpoint error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // });
// // // ✅ Update User Profile
// // router.put("/profile", verifyToken, async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       mobile,
// //       email,
// //       facebookProfile,
// //       facebookPage,
// //       address,
// //       businessType,
// //       bKashNumber,
// //     } = req.body;

// //     const user = await User.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Update fields
// //     user.name = name || user.name;
// //     user.mobile = mobile || user.mobile;
// //     user.email = email || user.email;
// //     user.facebookProfile = facebookProfile || user.facebookProfile;
// //     user.facebookPage = facebookPage || user.facebookPage;
// //     user.address = address || user.address;
// //     user.businessType = businessType || user.businessType;
// //     user.bKashNumber = bKashNumber || user.bKashNumber;

// //     await user.save();

// //     res.json({
// //       message: "Profile updated successfully",
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         mobile: user.mobile,
// //         role: user.role,
// //         remainingBalance: user.remainingBalance,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const User = require("../models/User");
// const Admin = require("../models/Admin");
// const verifyToken = require("../middleware/auth");

// // ✅ Register New User
// router.post("/register", async (req, res) => {
//   try {
//     console.log("📝 Registration request:", req.body);

//     const { name, email, mobile, password, confirmPassword } = req.body;

//     // Validation
//     if (!name || !email || !mobile || !password || !confirmPassword) {
//       return res.status(400).json({
//         message: "সব ফিল্ড পূরণ করুন",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         message: "পাসওয়ার্ড মিলছে না",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { mobile }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "ইমেইল বা মোবাইল নাম্বার ইতিমধ্যে রেজিস্টার্ড",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       mobile,
//       password: hashedPassword,
//       remainingBalance: 0,
//       totalOrders: 0,
//       totalSpentDollar: 0,
//       totalSpentTaka: 0,
//       role: "user",
//       registrationDate: new Date(),
//     });

//     await user.save();

//     // Create token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         userType: "user",
//         name: user.name,
//         mobile: user.mobile,
//       },
//       process.env.JWT_SECRET || "anonnota_secret_key",
//       { expiresIn: "7d" },
//     );

//     console.log("✅ User registered successfully:", user.email);

//     res.status(201).json({
//       message: "রেজিস্ট্রেশন সফল হয়েছে!",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//         remainingBalance: user.remainingBalance,
//         isAdmin: false,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Registration error:", error);
//     res.status(500).json({
//       message: error.message || "সার্ভারে সমস্যা হয়েছে",
//       details: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
//     });
//   }
// });

// // ✅ Login (Updated to check both User and Admin)
// router.post("/login", async (req, res) => {
//   try {
//     console.log("📨 Login request received:", req.body);

//     const { emailOrMobile, password } = req.body;

//     if (!emailOrMobile || !password) {
//       return res.status(400).json({
//         message: "ইমেইল/মোবাইল এবং পাসওয়ার্ড প্রয়োজন",
//       });
//     }

//     let user = null;
//     let userType = "user";

//     // প্রথমে User collection এ খুঁজুন
//     user = await User.findOne({
//       $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
//     });

//     // যদি User collection এ না মেলে, Admin collection এ খুঁজুন
//     if (!user) {
//       console.log("🔍 Searching in Admin collection...");
//       user = await Admin.findOne({
//         $or: [{ username: emailOrMobile }, { email: emailOrMobile }],
//       });
//       if (user) {
//         userType = "admin";
//         console.log("✅ Admin found:", user.username);
//       }
//     }

//     if (!user) {
//       console.log("❌ User/Admin not found");
//       return res
//         .status(400)
//         .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
//     }

//     console.log("🔐 Comparing password for:", userType);
//     const validPassword = await bcrypt.compare(password, user.password);

//     if (!validPassword) {
//       console.log("❌ Invalid password");
//       return res.status(400).json({ message: "ভুল পাসওয়ার্ড" });
//     }

//     console.log("✅ Password valid, creating token...");

//     // JWT payload তৈরি করুন
//     const payload = {
//       id: user._id,
//       role: user.role || userType,
//       userType: userType,
//     };

//     // username/email যোগ করুন
//     if (userType === "admin") {
//       payload.username = user.username;
//       payload.email = user.email || user.username;
//       payload.name = user.username;
//     } else {
//       payload.email = user.email;
//       payload.name = user.name;
//       payload.mobile = user.mobile;
//     }

//     const token = jwt.sign(
//       payload,
//       process.env.JWT_SECRET || "anonnota_secret_key",
//       { expiresIn: "7d" },
//     );

//     console.log("✅ Login successful for:", user.email || user.username);

//     // Response তৈরি করুন
//     const responseData = {
//       message: "লগইন সফল হয়েছে",
//       token,
//       user: {
//         id: user._id,
//         role: user.role || userType,
//         isAdmin: userType === "admin",
//       },
//     };

//     // userType অনুযায়ী অতিরিক্ত data যোগ করুন
//     if (userType === "admin") {
//       responseData.user.username = user.username;
//       responseData.user.email = user.email || user.username;
//       responseData.user.name = user.username || "Admin";
//     } else {
//       responseData.user.name = user.name;
//       responseData.user.email = user.email;
//       responseData.user.mobile = user.mobile;
//       responseData.user.remainingBalance = user.remainingBalance || 0;
//       responseData.user.facebookProfile = user.facebookProfile;
//       responseData.user.facebookPage = user.facebookPage;
//       responseData.user.address = user.address;
//       responseData.user.businessType = user.businessType;
//       responseData.user.bKashNumber = user.bKashNumber;
//       responseData.user.totalOrders = user.totalOrders || 0;
//       responseData.user.totalSpentDollar = user.totalSpentDollar || 0;
//       responseData.user.totalSpentTaka = user.totalSpentTaka || 0;
//       responseData.user.registrationDate = user.registrationDate;
//     }

//     res.json(responseData);
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     res.status(500).json({
//       message: "সার্ভারে সমস্যা হয়েছে",
//       error: error.message,
//       stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });
//   }
// });

// // ✅ Get User/Admin Profile (ME endpoint)
// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     console.log("🔍 Fetching user profile for:", req.user.id);

//     let user = null;

//     // JWT token থেকে userType চেক করুন
//     if (req.user.userType === "admin") {
//       // Admin হলে Admin collection থেকে খুঁজুন
//       user = await Admin.findById(req.user.id).select("-password");
//       console.log("👑 Admin profile found");
//     } else {
//       // User হলে User collection থেকে খুঁজুন
//       user = await User.findById(req.user.id).select("-password");
//       console.log("👤 User profile found");
//     }

//     if (!user) {
//       console.log("❌ User not found in database");
//       return res
//         .status(404)
//         .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
//     }

//     // Response format তৈরি করুন
//     const userResponse = {
//       id: user._id,
//       role: user.role || req.user.userType || "user",
//       isAdmin: req.user.userType === "admin",
//     };

//     // userType অনুযায়ী অতিরিক্ত ফিল্ড যোগ করুন
//     if (req.user.userType === "admin") {
//       userResponse.username = user.username;
//       userResponse.email = user.email || user.username;
//       userResponse.name = user.username || "Admin";
//     } else {
//       userResponse.name = user.name;
//       userResponse.email = user.email;
//       userResponse.mobile = user.mobile;
//       userResponse.facebookProfile = user.facebookProfile;
//       userResponse.facebookPage = user.facebookPage;
//       userResponse.address = user.address;
//       userResponse.businessType = user.businessType;
//       userResponse.bKashNumber = user.bKashNumber;
//       userResponse.remainingBalance = user.remainingBalance || 0;
//       userResponse.totalOrders = user.totalOrders || 0;
//       userResponse.totalSpentDollar = user.totalSpentDollar || 0;
//       userResponse.totalSpentTaka = user.totalSpentTaka || 0;
//       userResponse.registrationDate = user.registrationDate;
//     }

//     console.log("✅ Profile fetched successfully");
//     res.json({
//       user: userResponse,
//     });
//   } catch (error) {
//     console.error("❌ ME endpoint error:", error);
//     res.status(500).json({
//       message: "প্রোফাইল লোড করতে সমস্যা হয়েছে",
//       error: error.message,
//     });
//   }
// });

// // ✅ Update User Profile
// router.put("/profile", verifyToken, async (req, res) => {
//   try {
//     console.log("📝 Updating profile for user:", req.user.id);

//     const {
//       name,
//       mobile,
//       email,
//       facebookProfile,
//       facebookPage,
//       address,
//       businessType,
//       bKashNumber,
//     } = req.body;

//     // শুধু User এর জন্য প্রোফাইল আপডেট (Admin এর জন্য আলাদা endpoint লাগবে)
//     if (req.user.userType === "admin") {
//       return res.status(400).json({
//         message: "Admin প্রোফাইল এই endpoint দিয়ে আপডেট করা যাবে না",
//       });
//     }

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
//     }

//     // Check if email or mobile already exists (if changed)
//     if (email && email !== user.email) {
//       const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
//       if (emailExists) {
//         return res
//           .status(400)
//           .json({ message: "এই ইমেইল ইতিমধ্যে ব্যবহার করা হয়েছে" });
//       }
//     }

//     if (mobile && mobile !== user.mobile) {
//       const mobileExists = await User.findOne({
//         mobile,
//         _id: { $ne: user._id },
//       });
//       if (mobileExists) {
//         return res
//           .status(400)
//           .json({ message: "এই মোবাইল নাম্বার ইতিমধ্যে ব্যবহার করা হয়েছে" });
//       }
//     }

//     // Update fields
//     if (name) user.name = name;
//     if (mobile) user.mobile = mobile;
//     if (email) user.email = email;
//     if (facebookProfile !== undefined) user.facebookProfile = facebookProfile;
//     if (facebookPage !== undefined) user.facebookPage = facebookPage;
//     if (address !== undefined) user.address = address;
//     if (businessType !== undefined) user.businessType = businessType;
//     if (bKashNumber !== undefined) user.bKashNumber = bKashNumber;

//     await user.save();

//     console.log("✅ Profile updated successfully");

//     res.json({
//       message: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//         remainingBalance: user.remainingBalance,
//         facebookProfile: user.facebookProfile,
//         facebookPage: user.facebookPage,
//         address: user.address,
//         businessType: user.businessType,
//         bKashNumber: user.bKashNumber,
//         isAdmin: false,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Update profile error:", error);
//     res.status(500).json({
//       message: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
//       error: error.message,
//     });
//   }
// });

// // ✅ Change Password
// router.put("/change-password", verifyToken, async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "নতুন পাসওয়ার্ড মিলছে না" });
//     }

//     let user;
//     if (req.user.userType === "admin") {
//       user = await Admin.findById(req.user.id);
//     } else {
//       user = await User.findById(req.user.id);
//     }

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
//     }

//     const validPassword = await bcrypt.compare(currentPassword, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: "বর্তমান পাসওয়ার্ড ভুল" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Forgot Password (placeholder)
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "ইমেইল দিন" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "এই ইমেইলে কোনো অ্যাকাউন্ট নেই" });
//     }

//     // In production, you would send an email with reset link
//     // For now, just return success message
//     res.json({
//       message: "পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে",
//       note: "Development mode: Implement email sending functionality",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Admin = require("../models/Admin");
const verifyToken = require("../middleware/auth");

// ✅ Register New User (Email optional)
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration request:", req.body);

    const {
      name,
      email,
      mobile,
      facebookProfile,
      facebookPage,
      address,
      businessType,
      bKashNumber,
      password,
      confirmPassword,
    } = req.body;

    // ✅ Validation - শুধু required fields check করুন
    if (
      !name ||
      !mobile ||
      !password ||
      !confirmPassword ||
      !facebookProfile ||
      !address ||
      !businessType
    ) {
      return res.status(400).json({
        message:
          "নাম, মোবাইল, পাসওয়ার্ড, ফেসবুক প্রোফাইল, ঠিকানা এবং ব্যবসার ধরন প্রয়োজন",
        received: {
          name: !!name,
          mobile: !!mobile,
          password: !!password,
          confirmPassword: !!confirmPassword,
          facebookProfile: !!facebookProfile,
          address: !!address,
          businessType: !!businessType,
        },
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "পাসওয়ার্ড মিলছে না",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email || "" }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "ইমেইল বা মোবাইল নাম্বার ইতিমধ্যে রেজিস্টার্ড",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with ALL fields
    const user = new User({
      name,
      email: email || "", // ✅ Email optional
      mobile,
      facebookProfile: facebookProfile || "",
      facebookPage: facebookPage || "",
      address: address || "",
      businessType: businessType || "",
      bKashNumber: bKashNumber || "",
      password: hashedPassword,
      remainingBalance: 0,
      totalOrders: 0,
      totalSpentDollar: 0,
      totalSpentTaka: 0,
      role: "user",
      registrationDate: new Date(),
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email || user.mobile,
        role: user.role,
        userType: "user",
        name: user.name,
        mobile: user.mobile,
      },
      process.env.JWT_SECRET || "anonnota_secret_key",
      { expiresIn: "7d" },
    );

    console.log("✅ User registered successfully:", user.mobile);

    res.status(201).json({
      message: "রেজিস্ট্রেশন সফল হয়েছে!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        facebookProfile: user.facebookProfile,
        facebookPage: user.facebookPage,
        address: user.address,
        businessType: user.businessType,
        bKashNumber: user.bKashNumber,
        role: user.role,
        remainingBalance: user.remainingBalance,
        totalOrders: user.totalOrders,
        totalSpentDollar: user.totalSpentDollar,
        totalSpentTaka: user.totalSpentTaka,
        registrationDate: user.registrationDate,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      message: error.message || "সার্ভারে সমস্যা হয়েছে",
      details: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
    });
  }
});

// ✅ Login (Updated - email optional)
router.post("/login", async (req, res) => {
  try {
    console.log("📨 Login request received:", req.body);

    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        message: "ইমেইল/মোবাইল এবং পাসওয়ার্ড প্রয়োজন",
      });
    }

    let user = null;
    let userType = "user";

    // প্রথমে email/mobile দিয়ে User collection এ খুঁজুন
    user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    // যদি User collection এ না মেলে, Admin collection এ খুঁজুন
    if (!user) {
      console.log("🔍 Searching in Admin collection...");
      user = await Admin.findOne({
        $or: [{ username: emailOrMobile }, { email: emailOrMobile }],
      });
      if (user) {
        userType = "admin";
        console.log("✅ Admin found:", user.username);
      }
    }

    if (!user) {
      console.log("❌ User/Admin not found");
      return res
        .status(400)
        .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
    }

    console.log("🔐 Comparing password for:", userType);
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "ভুল পাসওয়ার্ড" });
    }

    console.log("✅ Password valid, creating token...");

    // JWT payload তৈরি করুন
    const payload = {
      id: user._id,
      role: user.role || userType,
      userType: userType,
    };

    // username/email যোগ করুন
    if (userType === "admin") {
      payload.username = user.username;
      payload.email = user.email || user.username;
      payload.name = user.username;
    } else {
      payload.email = user.email;
      payload.name = user.name;
      payload.mobile = user.mobile;
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "anonnota_secret_key",
      { expiresIn: "7d" },
    );

    console.log("✅ Login successful for:", user.email || user.mobile);

    // Response তৈরি করুন
    const responseData = {
      message: "লগইন সফল হয়েছে",
      token,
      user: {
        id: user._id,
        role: user.role || userType,
        isAdmin: userType === "admin",
      },
    };

    // userType অনুযায়ী অতিরিক্ত data যোগ করুন
    if (userType === "admin") {
      responseData.user.username = user.username;
      responseData.user.email = user.email || user.username;
      responseData.user.name = user.username || "Admin";
    } else {
      responseData.user.name = user.name;
      responseData.user.email = user.email;
      responseData.user.mobile = user.mobile;
      responseData.user.facebookProfile = user.facebookProfile;
      responseData.user.facebookPage = user.facebookPage;
      responseData.user.address = user.address;
      responseData.user.businessType = user.businessType;
      responseData.user.bKashNumber = user.bKashNumber;
      responseData.user.remainingBalance = user.remainingBalance || 0;
      responseData.user.totalOrders = user.totalOrders || 0;
      responseData.user.totalSpentDollar = user.totalSpentDollar || 0;
      responseData.user.totalSpentTaka = user.totalSpentTaka || 0;
      responseData.user.registrationDate = user.registrationDate;
    }

    res.json(responseData);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      message: "সার্ভারে সমস্যা হয়েছে",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// ✅ Get User/Admin Profile (ME endpoint)
// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     console.log("🔍 Fetching user profile for:", req.user.id);

//     let user = null;

//     // JWT token থেকে userType চেক করুন
//     if (req.user.userType === "admin") {
//       // Admin হলে Admin collection থেকে খুঁজুন
//       user = await Admin.findById(req.user.id).select("-password");
//       console.log("👑 Admin profile found");
//     } else {
//       // User হলে User collection থেকে খুঁজুন
//       user = await User.findById(req.user.id).select("-password");
//       console.log("👤 User profile found");
//     }

//     if (!user) {
//       console.log("❌ User not found in database");
//       return res
//         .status(404)
//         .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
//     }

//     // Response format তৈরি করুন
//     const userResponse = {
//       id: user._id,
//       role: user.role || req.user.userType || "user",
//       isAdmin: req.user.userType === "admin",
//     };

//     // userType অনুযায়ী অতিরিক্ত ফিল্ড যোগ করুন
//     if (req.user.userType === "admin") {
//       userResponse.username = user.username;
//       userResponse.email = user.email || user.username;
//       userResponse.name = user.username || "Admin";
//     } else {
//       userResponse.name = user.name;
//       userResponse.email = user.email;
//       userResponse.mobile = user.mobile;
//       userResponse.facebookProfile = user.facebookProfile;
//       userResponse.facebookPage = user.facebookPage;
//       userResponse.address = user.address;
//       userResponse.businessType = user.businessType;
//       userResponse.bKashNumber = user.bKashNumber;
//       userResponse.remainingBalance = user.remainingBalance || 0;
//       userResponse.totalOrders = user.totalOrders || 0;
//       userResponse.totalSpentDollar = user.totalSpentDollar || 0;
//       userResponse.totalSpentTaka = user.totalSpentTaka || 0;
//       userResponse.registrationDate = user.registrationDate;
//     }

//     console.log("✅ Profile fetched successfully");
//     res.json({
//       user: userResponse,
//     });
//   } catch (error) {
//     console.error("❌ ME endpoint error:", error);
//     res.status(500).json({
//       message: "প্রোফাইল লোড করতে সমস্যা হয়েছে",
//       error: error.message,
//     });
//   }
// });

// routes/auth.js - /me endpoint এ আপডেট করুন

router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Fetching user profile for:", req.user.id);

    let user = null;

    if (req.user.userType === "admin") {
      user = await Admin.findById(req.user.id).select("-password");
      console.log("👑 Admin profile found");
    } else {
      // ✅ User-এর জন্য Order count সহ fetch করুন
      user = await User.findById(req.user.id).select(
        "-password -resetPasswordToken -resetPasswordExpires",
      );
      console.log("👤 User profile found");
    }

    if (!user) {
      console.log("❌ User not found in database");
      return res
        .status(404)
        .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
    }

    // ✅ User হলে totalOrders calculate করুন
    if (req.user.userType === "user") {
      const Order = require("../models/Order");
      const totalOrders = await Order.countDocuments({ userId: user._id });
      user.totalOrders = totalOrders; // ✅ totalOrders set করুন
    }

    // Response format তৈরি করুন
    const userResponse = {
      id: user._id,
      role: user.role || req.user.userType || "user",
      isAdmin: req.user.userType === "admin",
    };

    if (req.user.userType === "admin") {
      userResponse.username = user.username;
      userResponse.email = user.email || user.username;
      userResponse.name = user.username || "Admin";
    } else {
      // ✅ সম্পূর্ণ user data send করুন
      userResponse.name = user.name;
      userResponse.email = user.email;
      userResponse.mobile = user.mobile;
      userResponse.facebookProfile = user.facebookProfile;
      userResponse.facebookPage = user.facebookPage;
      userResponse.address = user.address;
      userResponse.businessType = user.businessType;
      userResponse.bKashNumber = user.bKashNumber;
      userResponse.remainingBalance = user.remainingBalance || 0;
      userResponse.totalOrders = user.totalOrders || 0; // ✅ totalOrders include
      userResponse.totalSpentDollar = user.totalSpentDollar || 0;
      userResponse.totalSpentTaka = user.totalSpentTaka || 0;
      userResponse.registrationDate = user.registrationDate;
      userResponse.createdAt = user.createdAt;
    }

    console.log(
      "✅ Profile fetched successfully, totalOrders:",
      userResponse.totalOrders,
    );
    res.json({
      success: true, // ✅ success field যোগ করুন
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ ME endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "প্রোফাইল লোড করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
});

// ✅ Update User Profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    console.log("📝 Updating profile for user:", req.user.id);

    const {
      name,
      mobile,
      email,
      facebookProfile,
      facebookPage,
      address,
      businessType,
      bKashNumber,
    } = req.body;

    // শুধু User এর জন্য প্রোফাইল আপডেট
    if (req.user.userType === "admin") {
      return res.status(400).json({
        message: "Admin প্রোফাইল এই endpoint দিয়ে আপডেট করা যাবে না",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
    }

    // Check if email or mobile already exists (if changed)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "এই ইমেইল ইতিমধ্যে ব্যবহার করা হয়েছে" });
      }
    }

    if (mobile && mobile !== user.mobile) {
      const mobileExists = await User.findOne({
        mobile,
        _id: { $ne: user._id },
      });
      if (mobileExists) {
        return res
          .status(400)
          .json({ message: "এই মোবাইল নাম্বার ইতিমধ্যে ব্যবহার করা হয়েছে" });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;
    if (facebookProfile !== undefined) user.facebookProfile = facebookProfile;
    if (facebookPage !== undefined) user.facebookPage = facebookPage;
    if (address !== undefined) user.address = address;
    if (businessType !== undefined) user.businessType = businessType;
    if (bKashNumber !== undefined) user.bKashNumber = bKashNumber;

    await user.save();

    console.log("✅ Profile updated successfully");

    res.json({
      message: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        remainingBalance: user.remainingBalance,
        facebookProfile: user.facebookProfile,
        facebookPage: user.facebookPage,
        address: user.address,
        businessType: user.businessType,
        bKashNumber: user.bKashNumber,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      message: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
});

// ✅ Change Password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "নতুন পাসওয়ার্ড মিলছে না" });
    }

    let user;
    if (req.user.userType === "admin") {
      user = await Admin.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "বর্তমান পাসওয়ার্ড ভুল" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
