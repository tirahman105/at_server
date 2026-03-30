const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  dollarRate: {
    type: Number,
    default: 162,
  },
  telegramBotToken: {
    type: String,
    default: "",
  },
  telegramChatId: {
    type: String,
    default: "",
  },
  bkashNumber: {
    type: String,
    default: "01723840249",
  },
  supportEmail: {
    type: String,
    default: "support@anonnota.com",
  },
  supportPhone: {
    type: String,
    default: "01614048774",
  },
  whatsappNumber: {
    type: String,
    default: "01614048774",
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  autoOrderApprove: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
