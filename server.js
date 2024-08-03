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

// app.use("/api/image", require("./routes/imagesRoutes"));
// app.use(errorHandler);

const Image = require("./routes/imagesRoutes");

app.use(
  bodyParser.json({ limit: "30mb", extended: true }),
  bodyParser.urlencoded({ limit: "30mb", extended: true }),
  errorHandler,
  cors(),
  Image
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
