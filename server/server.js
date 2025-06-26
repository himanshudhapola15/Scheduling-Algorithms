const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const uploadRoute = require("./routes/upload.js");
app.use("/api/upload", uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
