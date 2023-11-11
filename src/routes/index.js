"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check api key
router.use(apiKey);
// check permisson
router.use(permission("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;