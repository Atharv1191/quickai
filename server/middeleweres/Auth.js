const { clerkClient } = require('@clerk/express');

// Middleware to check userId and whether the user has a premium plan
const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth(); // ✅ This assumes `req.auth()` exists
    console.log("🧪 Backend userId:", userId);
    const hasPremiumPlan = await has({ plan: "premium" }); // ✅ spelling fixed: "primium" → "premium"

    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = auth;
