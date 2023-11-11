"use strict";

const mongoose = require("mongoose");
const os = require("os");
const _SECOND = 5000;
const process = require("process");

const countConnect = () => {
  const countConnection = mongoose.connections.length;
  console.log("countConnection: ", countConnection);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss; // Lay Memory
    const maxConnection = numCores * 5;

    // console.log("Active connection", numConnection);
    // console.log("memoryUsage: ", memoryUsage / 1024 / 1024, "MB");

    if (numConnection > maxConnection) {
      console.log("Connection overload detected!");
    }
  }, _SECOND);
};

module.exports = { countConnect, checkOverLoad };
