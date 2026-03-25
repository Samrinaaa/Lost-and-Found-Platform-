const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoute = require("./routes/authRoute");
const lostItemRoute = require("./routes/lostItemRoute");
const foundItemRoute = require("./routes/foundItemRoute");
const claimRoute = require("./routes/claimRoute");
const adminRoute = require("./routes/adminRoute");

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Default route
app.get("/", (req, res) => {
  res.send("Lost & Found API Running...");
});

// Use Routes
app.use("/api/auth", authRoute);
app.use("/api/lost", lostItemRoute);
app.use("/api/found", foundItemRoute);
app.use("/api/claim", claimRoute);
app.use("/api/admin", adminRoute);

// Start server
app.listen(5001, () => console.log("Server running on port 5001"));