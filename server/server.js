const express = require("express");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require('@clerk/express');
require("dotenv").config();

const aiRoute = require('./routes/aiRoutes');
const userRoute = require('./routes/userRoutes');
const connectCloudinary = require("./configs/cloudinary");

const app = express();
connectCloudinary();

app.use(express.json());
app.use(cors());

// Clerk middleware
app.use(clerkMiddleware());

// Protected routes
app.use(requireAuth());
app.use('/api/ai', aiRoute);
app.use('/api/user', userRoute);

// Test route
app.get('/', (req, res) => {
  res.send("server is live");
});

// ✅ Don't call app.listen()
module.exports = app; // ✅ Correct export for Vercel
