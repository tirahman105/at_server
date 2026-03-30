// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const Settings = require("./models/Settings");

mongoose.connect(process.env.MONGODB_URI);

async function seed() {
  try {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: "at@admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Tareq12@", 10);
      const admin = new Admin({
        username: "at@admin",
        password: hashedPassword,
        role: "admin",
        email: "at@admin",
      });
      await admin.save();
      console.log("✅ Admin user created:");
      console.log("   Username: at@admin");
      console.log("   Password: Tareq12@");
      console.log("   Role: admin");
    } else {
      console.log("✅ Admin user already exists");
      console.log("   Username:", existingAdmin.username);
    }

    // Check if settings exist
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      const settings = new Settings({
        dollarRate: 162,
        bkashNumber: "01712345678",
        supportEmail: "support@anonnota.com",
        supportPhone: "01712345678",
      });
      await settings.save();
      console.log("✅ Default settings created");
    } else {
      console.log("✅ Settings already exist");
    }

    console.log("✅ Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
