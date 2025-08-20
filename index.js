const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

// use db
connectDb();

app.get("/",(req,res)=>{
    res.send("Express app is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});


app.listen(process.env.PORT,()=>{
    console.log("Server is listening on "+process.env.PORT);
})