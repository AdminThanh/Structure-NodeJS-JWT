"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  FobiddenError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");
const { log } = require("console");
const keytokenModel = require("../models/keytoken.model");

const RoleUser = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    /*
      Check token Used
    */
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    if (foundToken) {
      // decode xem may la thang nao?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      // xoa token use di
      await KeyTokenService.deleteKeyById({ userId });
      throw new FobiddenError("Something wrong happend!! Please Relogin");
    }

    // chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("User not registered");

    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // check userId
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("User not registered");

    // create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // Update lai token moi
    // await holderToken.update({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken,
    //   },
    // });
    await keytokenModel.updateOne(
      { refreshToken: refreshToken },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      }
    );
    return {
      user: { userId, email },
      tokens,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    /*
      1. Check email in DB
      2. Match password
      3. Create Access token vs Refresh token and save
      4. Generate token
      5. get data return login
      */

    // 1
    const userFound = await findByEmail({ email });
    if (!userFound) {
      throw new BadRequestError("Shop not registered");
    }

    // 2
    const match = bcrypt.compare(password, userFound.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4
    const { _id: userId } = userFound;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        fileds: ["_id", "name", "email"],
        object: userFound,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    // step 1: check email ton tai
    const hodelUser = await userModel.findOne({ email }).lean();
    if (hodelUser) {
      throw new BadRequestError("Email đã tồn tại trong hệ thống!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: RoleUser.CLIENT,
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // publicKey
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Keystore Error!");
      }

      //create tokens pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );
      return {
        user: getInfoData({
          fileds: ["_id", "name", "email", "roles"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("delKey==", delKey);
    return delKey;
  };
}
module.exports = AccessService;
