
const express = require("express")
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require('@clerk/express');

require("dotenv").config()
const aiRoute = require('./routes/aiRoutes');
const userRoute = require('./routes/userRoutes');
const connectCloudinary = require("./configs/cloudinary");
const app = express()
 connectCloudinary()

app.use(express.json())
app.use(cors())

app.use(clerkMiddleware())
app.use(requireAuth())
app.use('/api/ai',aiRoute)
app.use('/api/user',userRoute)
app.get('/',(req,res)=>res.send("server is running"))
const PORT= process.env.PORT || 3000

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))
module.exports = app;
