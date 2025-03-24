const express = require("express");
require("dotenv").config(); // ✅ Correct dotenv import
const errorHandler = require("./midleware/errorHandler");
const cors = require("cors");
const bodyParser = require("body-parser");

// Uncomment if using a database
// const connectDb = require("./config/dbConnection");
// connectDb();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Define CORS before routes
const whitelist = [
  "https://dpg.vercel.app",
  "https://dpg-dev.vercel.app",
  "http://localhost:3000",
  "https://www.imageflexstudio.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Use middlewares in correct order
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "300mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }));

// ✅ Load routes after middleware
app.use("/", require("./routes/default"));
app.use(require("./routes/imagesRoutes"));
app.use(require("./routes/controlerRoutes"));
app.use(require("./routes/userRoutes"));

// ✅ Error handler should be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
