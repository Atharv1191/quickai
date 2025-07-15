const express = require("express");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require('@clerk/express');
require("dotenv").config();

const aiRoute = require('./routes/aiRoutes');
const userRoute = require('./routes/userRoutes');
const connectCloudinary = require("./configs/cloudinary");

const app = express();

// Connect Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); // Attach Clerk to req

// ✅ Public route (no auth)
app.get('/', (req, res) => {
  res.send("API is live ✅");
});

// ✅ Protected routes
app.use('/api/ai', requireAuth(), aiRoute);
app.use('/api/user', requireAuth(), userRoute);

// ✅ Local server only for development (Vercel handles it differently)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

// ✅ Export app for Vercel
module.exports = app;
