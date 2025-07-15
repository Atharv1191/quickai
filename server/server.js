const express = require("express");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require('@clerk/express');
require("dotenv").config();

const aiRoute = require('./routes/aiRoutes');
const userRoute = require('./routes/userRoutes');
const connectCloudinary = require("./configs/cloudinary");

const app = express();

// Cloudinary setup
connectCloudinary();

// General middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ Public route (DO NOT protect with requireAuth)
app.get('/', (req, res) => {
  res.send("API is live ✅");
});

// ✅ Only apply requireAuth() to protected routes
app.use('/api/ai', requireAuth(), aiRoute);
app.use('/api/user', requireAuth(), userRoute);

// Start server locally only
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}


