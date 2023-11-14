"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();
// signUp
router.post("/user/signup", asyncHandler(AccessController.signUp));
router.post("/user/login", asyncHandler(AccessController.login));

// authentication
router.use(authentication);

router.post("/user/logout", asyncHandler(AccessController.logout));
router.post("/user/handleRefreshToken", asyncHandler(AccessController.handleRefreshToken));


module.exports = router;
