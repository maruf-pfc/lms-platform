const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV || "dev" })
);

app.use("/api", routes);

module.exports = app;
