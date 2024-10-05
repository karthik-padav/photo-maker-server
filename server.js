const express = require("express");
const errorHandler = require("./midleware/errorHandler");
const connectDb = require("./config/dbConnection,js");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

connectDb();
const app = express();

const port = process.env.PORT || 3000;

// app.use(express.json());
app.use("/", require("./routes/default"));
// const cron = require("node-cron");

const Image = require("./routes/imagesRoutes");
const Controler = require("./routes/controlerRoutes");
const User = require("./routes/userRoutes");

const corsOptions = {
  origin: "https://dpg.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(
  bodyParser.json({ limit: "30mb", extended: true }),
  bodyParser.urlencoded({ limit: "30mb", extended: true }),
  errorHandler,
  cors(corsOptions),
  Image,
  Controler,
  User
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
