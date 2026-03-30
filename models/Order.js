// // models/Order.js - WITHOUT pre-save middleware
// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     dollarAmount: {
//       type: Number,
//       required: true,
//       min: 4,
//     },
//     takaAmount: {
//       type: Number,
//       required: true,
//     },
//     dollarRate: {
//       type: Number,
//       default: 162,
//     },
//     profitPerDollar: {
//       type: Number,
//       default: 30,
//     },
//     totalProfit: {
//       type: Number,
//       default: 0,
//     },
//     mainCosting: {
//       type: Number,
//       default: 0,
//     },
//     // boostingType: {
//     //   type: String,
//     //   required: true,
//     //   enum: [
//     //     "Message Campaign",
//     //     "Engagement",
//     //     "Video View",
//     //     "Website Traffic",
//     //     "Ad Campaign",
//     //   ],
//     // },

//     boostingType: {
//       type: String,
//       required: true,
//       enum: [
//         "Get more messages",
//         "Get More Engagement",
//         "Video View",
//         "Awareness",
//         "Traffic",
//         "Leads",
//         "Engagement (Get more message)",
//         "Sales",
//         "Page Like",
//         "Follow",
//       ],
//     },
//     facebookPostLink: {
//       type: String,
//       required: true,
//     },
//     paymentBkashNumber: {
//       type: String,
//       required: true,
//     },
//     paymentAmount: {
//       type: Number,
//       required: true,
//     },
//     paymentVerified: {
//       type: Boolean,
//       default: false,
//     },
//     orderStatus: {
//       type: String,
//       enum: ["Pending", "Started", "Completed", "Cancelled"],
//       default: "Pending",
//     },
//     withdrawStatus: {
//       type: String,
//       enum: ["Not Yet", "Done"],
//       default: "Not Yet",
//     },
//     cardLoad: {
//       type: String,
//       enum: ["Not Yet", "Done"],
//       default: "Not Yet",
//     },
//     remarks: {
//       type: String,
//       default: "",
//     },
//     note: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true, // Mongoose automatically handles createdAt and updatedAt
//   },
// );

// module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dollarAmount: {
      type: Number,
      required: true,
      min: 4,
    },
    takaAmount: {
      type: Number,
      required: true,
    },
    dollarRate: {
      type: Number,
      default: 162,
    },
    profitPerDollar: {
      type: Number,
      default: 30,
    },
    totalProfit: {
      type: Number,
      default: 0,
    },
    mainCosting: {
      type: Number,
      default: 0,
    },

    // ✅ NEW: Service Category (Boosting, Ad Campaign, Promotion)
    serviceCategory: {
      type: String,
      enum: ["Boosting", "Ad Campaign", "Promotion"],
      default: "",
    },

    // ✅ NEW: Service Sub Type
    serviceSubType: {
      type: String,
      enum: [
        "Get more messages",
        "Get More Engagement",
        "Video View",
        "Awareness",
        "Traffic",
        "Leads",
        "Engagement (Get more message)",
        "Sales",
        "Page Like",
        "Follow",
      ],
      default: "",
    },

    boostingType: {
      type: String,
      required: true,
      enum: [
        "Get more messages",
        "Get More Engagement",
        "Video View",
        "Awareness",
        "Traffic",
        "Leads",
        "Engagement (Get more message)",
        "Sales",
        "Page Like",
        "Follow",
      ],
    },
    facebookPostLink: {
      type: String,
      required: true,
    },
    paymentBkashNumber: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Started", "Completed", "Cancelled"],
      default: "Pending",
    },
    withdrawStatus: {
      type: String,
      enum: ["Not Yet", "Done"],
      default: "Not Yet",
    },
    cardLoad: {
      type: String,
      enum: ["Not Yet", "Done"],
      default: "Not Yet",
    },
    remarks: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
