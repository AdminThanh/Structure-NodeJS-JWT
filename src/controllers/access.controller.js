"use strict";

const { CREATED, SuccessResponse, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  // handleRefreshToken = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Get token success",
  //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
  //   }).send(res);
  // };
  handleRefreshTokenV2 = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const signUpResult = await AccessService.signUp(req.body);

    new CREATED({
      message: "Registed OK!",
      metadata: signUpResult,
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
module.exports = new AccessController();
