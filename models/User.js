// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     mobile: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       trim: true,
// //     },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       lowercase: true,
// //       trim: true,
// //     },
// //     facebookProfile: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     facebookPage: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     address: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     businessType: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     bKashNumber: {
// //       type: String,
// //       trim: true,
// //     },
// //     password: {
// //       type: String,
// //       required: true,
// //       minlength: 6,
// //     },
// //     role: {
// //       type: String,
// //       enum: ["user", "admin"],
// //       default: "user",
// //     },
// //     remainingBalance: {
// //       type: Number,
// //       default: 0,
// //     },
// //     totalOrders: {
// //       type: Number,
// //       default: 0,
// //     },
// //     totalSpentDollar: {
// //       type: Number,
// //       default: 0,
// //     },
// //     totalSpentTaka: {
// //       type: Number,
// //       default: 0,
// //     },
// //     registrationDate: {
// //       type: Date,
// //       default: Date.now,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   },
// // );

// // module.exports = mongoose.model("User", userSchema);

// // models/User.js
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   mobile: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   facebookProfile: {
//     type: String,
//     default: "",
//     trim: true,
//   },
//   facebookPage: {
//     type: String,
//     default: "",
//     trim: true,
//   },
//   address: {
//     type: String,
//     default: "",
//   },
//   businessType: {
//     type: String,
//     default: "",
//   },
//   bKashNumber: {
//     type: String,
//     default: "",
//   },
//   remainingBalance: {
//     type: Number,
//     default: 0,
//   },
//   totalOrders: {
//     type: Number,
//     default: 0,
//   },
//   totalSpentDollar: {
//     type: Number,
//     default: 0,
//   },
//   totalSpentTaka: {
//     type: Number,
//     default: 0,
//   },
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
//   registrationDate: {
//     type: Date,
//     default: Date.now,
//   },
//   lastLogin: {
//     type: Date,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// });

// // Remove password when converting to JSON
// UserSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

// module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true, // ✅ Allows multiple null values
    unique: true,
    lowercase: true,
    trim: true,
    default: "",
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  facebookProfile: {
    type: String,
    default: "",
    trim: true,
  },
  facebookPage: {
    type: String,
    default: "",
    trim: true,
  },
  address: {
    type: String,
    default: "",
  },
  businessType: {
    type: String,
    default: "",
  },
  bKashNumber: {
    type: String,
    default: "",
  },
  remainingBalance: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpentDollar: {
    type: Number,
    default: 0,
  },
  totalSpentTaka: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// Remove password when converting to JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
