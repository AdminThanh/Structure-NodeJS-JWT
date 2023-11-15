"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// signUp
router.post("/user/signup", asyncHandler(AccessController.signUp));
router.post("/user/login", asyncHandler(AccessController.login));

// authentication
router.use(authenticationV2);

router.post("/user/logout", asyncHandler(AccessController.logout));
router.post("/user/refreshToken", asyncHandler(AccessController.handleRefreshTokenV2));


module.exports = router;
