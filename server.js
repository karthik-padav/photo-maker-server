const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use("/api", require("./routes/default"));
app.use("/api/image", require("./routes/imagesRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
