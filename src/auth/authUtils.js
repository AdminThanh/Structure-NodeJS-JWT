"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const { keys } = require("lodash");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify");
      } else {
        console.log("Verify DECODE: ", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1. check userID missing
  2. Get accessToken
  3. Verify token
  4. Check user DB
  5. Check keyStore with userID
  6. OK ALL => Return next()
  */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("NotFound keyStore");

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("NotFound Request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
