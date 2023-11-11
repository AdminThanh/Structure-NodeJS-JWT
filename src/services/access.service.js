"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleUser = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email ton tai
      const hodelUser = await userModel.findOne({ email }).lean();
      if (hodelUser) {
        return {
          code: "xxx",
          message: "Email đã tồn tại",
          status: "Error",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        name,
        email,
        password: passwordHash,
        roles: RoleUser.CLIENT
      });

      if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // publicKey
        console.log({ privateKey, publicKey }); // save vào collection KeyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "PublicKeyString Error",
          };
        }

        //create tokens pair
        const tokens = await createTokenPair(
          { userId: newUser._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            user: getInfoData({
              fileds: ["_id", "name", "email","roles"],
              object: newUser,
            }),
            tokens,
          },
        };
        // const tokens = await
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "Error",
      };
    }
  };
}
module.exports = AccessService;
