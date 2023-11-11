require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const app = express();

// init Middlewares
app.use(morgan("dev"));
app.use(helmet()); // Hide info
app.use(compression()); // nén dung lượng web
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init DB
require("./dbs/init.mongodb");
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();

// init Rourter
app.use("", require("./routes/"));

// Handle error

module.exports = app;
