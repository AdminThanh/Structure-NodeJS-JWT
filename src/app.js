require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const { error } = require("console");
const app = express();

// init Middlewares
app.use(morgan("dev"));
app.use(helmet()); // Hide info
app.use(compression()); // nén dung lượng web

// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
app.use(express.json({ limit: "10mb", parameterLimit: 10000000 }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 10000000,
  })
);

// init DB
require("./dbs/init.mongodb");
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();

// init Rourter
app.use("", require("./routes/"));

// Handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
