// jobs/updateOrderStatusJob.js
const Order = require("../models/Order");

const updateOrderStatusJob = () => {
  console.log("📅 Order status update job initialized");

  // Manual update function that can be called
  const manualUpdate = async () => {
    try {
      const now = new Date();

      // Update orders that should be started (Pending -> Running)
      const startedResult = await Order.updateMany(
        {
          startDate: { $lte: now, $ne: null },
          orderStatus: "Pending",
        },
        {
          $set: { orderStatus: "Running", updatedAt: now },
        },
      );

      // Update orders that should be completed (Running/Started/Pending -> Completed)
      const completedResult = await Order.updateMany(
        {
          endDate: { $lte: now, $ne: null },
          orderStatus: { $in: ["Pending", "Running", "Started"] },
        },
        {
          $set: { orderStatus: "Completed", updatedAt: now },
        },
      );

      if (
        startedResult.modifiedCount > 0 ||
        completedResult.modifiedCount > 0
      ) {
        console.log(
          `✅ Status updated: ${startedResult.modifiedCount} started, ${completedResult.modifiedCount} completed`,
        );
      }

      return {
        startedOrders: startedResult.modifiedCount,
        completedOrders: completedResult.modifiedCount,
      };
    } catch (error) {
      console.error("Error updating statuses:", error);
      return { startedOrders: 0, completedOrders: 0 };
    }
  };

  // Return the function so it can be called manually
  return { manualUpdate };
};

module.exports = updateOrderStatusJob;
