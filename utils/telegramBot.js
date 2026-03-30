// // utils/telegramBot.js
// const axios = require("axios");

// /**
//  * Send order notification to Telegram
//  * @param {Object} order - Order object
//  * @param {Object} user - User object
//  */
// const sendOrderNotification = async (order, user) => {
//   const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//   const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

//   // Check if Telegram is configured
//   if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//     console.log("⚠️ Telegram bot not configured. Skipping notification.");
//     return;
//   }

//   // Format user info safely
//   const userName = user?.name || "N/A";
//   const userMobile = user?.mobile || "N/A";
//   const userEmail = user?.email || "N/A";

//   // Format message with emojis
//   const message = `
// 🎉 **নতুন অর্ডার এসেছে!** 🎉

// 📦 **অর্ডার আইডি:** ${order.orderId || "N/A"}
// 👤 **ব্যবহারকারী:** ${userName}
// 📞 **মোবাইল:** ${userMobile}
// 📧 **ইমেইল:** ${userEmail}

// 💰 **পরিমাণ:** $${order.dollarAmount} (৳${order.takaAmount})
// 📊 **বুটিং টাইপ:** ${order.boostingType}
// 🔗 **পোস্ট লিংক:** ${order.facebookPostLink}

// 💳 **bKash নাম্বার:** ${order.paymentBkashNumber}
// 💵 **পেমেন্ট পরিমাণ:** ৳${order.paymentAmount}

// 📝 **নোট:** ${order.note || "কোন নোট নেই"}
// 🕒 **সময়:** ${new Date().toLocaleString("bn-BD")}

// 🚀 **অর্ডার স্ট্যাটাস:** ${order.orderStatus}
// `;

//   try {
//     const response = await axios.post(
//       `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//       {
//         chat_id: TELEGRAM_CHAT_ID,
//         text: message,
//         parse_mode: "Markdown",
//         reply_markup: {
//           inline_keyboard: [
//             [
//               {
//                 text: "✅ অর্ডার দেখা",
//                 url: `http://localhost:3000/admin/orders/${order._id}`,
//               },
//             ],
//             [
//               {
//                 text: "👤 ইউজার প্রোফাইল",
//                 url: `http://localhost:3000/admin/users/${order.userId}`,
//               },
//             ],
//           ],
//         },
//       },
//     );

//     console.log("✅ Telegram notification sent successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Telegram notification failed:", error.message);

//     // If error, send a simpler message
//     try {
//       const simpleMessage = `নতুন অর্ডার: ${order.orderId} - $${order.dollarAmount} - ${order.boostingType}`;
//       await axios.post(
//         `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//         {
//           chat_id: TELEGRAM_CHAT_ID,
//           text: simpleMessage,
//         },
//       );
//     } catch (simpleError) {
//       console.error(
//         "❌ Even simple Telegram notification failed:",
//         simpleError.message,
//       );
//     }
//   }
// };

// /**
//  * Send admin notification
//  * @param {String} message - Notification message
//  * @param {String} type - success/error/info
//  */
// const sendAdminNotification = async (message, type = "info") => {
//   const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//   const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

//   if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//     return;
//   }

//   const emoji =
//     {
//       success: "✅",
//       error: "❌",
//       info: "ℹ️",
//       warning: "⚠️",
//     }[type] || "📢";

//   const formattedMessage = `${emoji} ${message}`;

//   try {
//     await axios.post(
//       `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//       {
//         chat_id: TELEGRAM_CHAT_ID,
//         text: formattedMessage,
//         parse_mode: "Markdown",
//       },
//     );
//   } catch (error) {
//     console.error("Telegram admin notification failed:", error);
//   }
// };

// /**
//  * Send order status update notification
//  * @param {Object} order - Order object
//  * @param {String} oldStatus - Previous status
//  * @param {String} newStatus - New status
//  */
// const sendStatusUpdateNotification = async (order, oldStatus, newStatus) => {
//   const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//   const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

//   if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//     return;
//   }

//   const message = `
// 🔄 **অর্ডার স্ট্যাটাস আপডেট**

// 📦 **অর্ডার আইডি:** ${order.orderId}
// 👤 **ব্যবহারকারী:** ${order.userId?.name || "N/A"}

// 📊 **পূর্ববর্তী স্ট্যাটাস:** ${oldStatus}
// ✅ **নতুন স্ট্যাটাস:** ${newStatus}

// 💰 **পরিমাণ:** $${order.dollarAmount} (৳${order.takaAmount})
// 🔗 **পোস্ট লিংক:** ${order.facebookPostLink}

// 🕒 **আপডেট সময়:** ${new Date().toLocaleString("bn-BD")}
// `;

//   try {
//     await axios.post(
//       `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//       {
//         chat_id: TELEGRAM_CHAT_ID,
//         text: message,
//         parse_mode: "Markdown",
//       },
//     );
//   } catch (error) {
//     console.error("Telegram status update notification failed:", error);
//   }
// };

// module.exports = {
//   sendOrderNotification,
//   sendAdminNotification,
//   sendStatusUpdateNotification,
// };

// utils/telegramBot.js - নিশ্চিত করুন এই কোড আছে
const axios = require("axios");

const sendOrderNotification = async (order, user) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Check if Telegram is configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("⚠️ Telegram bot not configured. Skipping notification.");
    return;
  }

  // Format message
  const message = `
🎉 **নতুন অর্ডার এসেছে!** 🎉

📦 **অর্ডার আইডি:** ${order.orderId}
👤 **ব্যবহারকারী:** ${user?.name || "N/A"}
📞 **মোবাইল:** ${user?.mobile || "N/A"}
📧 **ইমেইল:** ${user?.email || "N/A"}

💰 **পরিমাণ:** $${order.dollarAmount} (৳${order.takaAmount})
📊 **বুস্টিং টাইপ:** ${order.boostingType}
🔗 **পোস্ট লিংক:** ${order.facebookPostLink}

💳 **bKash নাম্বার:** ${order.paymentBkashNumber}
💵 **পেমেন্ট পরিমাণ:** ৳${order.paymentAmount}

📝 **নোট:** ${order.note || "কোন নোট নেই"}
🕒 **সময়:** ${new Date().toLocaleString("bn-BD")}
`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      },
    );

    console.log("✅ Telegram notification sent successfully");
  } catch (error) {
    console.error("❌ Telegram notification failed:", error.message);
  }
};

module.exports = { sendOrderNotification };
