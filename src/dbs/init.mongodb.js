"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`; //process.env.MONGO_URI
const { countConnect } = require("../helpers/check.connect");
console.log("ConnectString: ", connectString);
class Database {
  constructor() {
    this.connect();
  }
  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // Số lượng connect max -> cho xếp hàng khi quá tải connect
      })
      .then((_) => {
        countConnect();
        console.log("Connect MongoDB Success");
      })
      .catch((_) => console.log("Error Connect MongoDB"));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
