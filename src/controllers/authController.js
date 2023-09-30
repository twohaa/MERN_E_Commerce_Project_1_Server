const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("./responseContoller");
const { createJSONwebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../helper/cookie");

const handleLogin = async (req, res, next) => {
  try {
    // email,password
    const { email, password } = req.body;

    // check isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User dosen't exist with this email,Please Register First..."
      );
    }

    // compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email or password dosen't match...");
    }

    // check isBanned
    if (user.isBanned) {
      throw createError(403, "You are banned,please contact with authority...");
    }

    // generate token & create jwt
    const accessToken = createJSONwebToken({ user }, jwtAccessKey, "20m");
    // generate cookie
    setAccessTokenCookie(res, accessToken);

    // generate refesh token & create jwt
    const refreshToken = createJSONwebToken({ user }, jwtRefreshKey, "7d");
    // generate cookie for refresh token
    setRefreshTokenCookie(res, refreshToken);

    //user without password
    const userWithoutpassword = user.toObject();
    delete userWithoutpassword.password;

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "User is logged in successfully",
      payload: { userWithoutpassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "User is logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    //verify the old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh token,please login again...");
    }

    // generate token & create jwt
    const accessToken = createJSONwebToken(
      decodedToken.user,
      jwtAccessKey,
      "20m"
    );

    // generate cookie
    setAccessTokenCookie(res, accessToken);

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated..",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleProtected = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    //verify the old refresh token
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token,please login again...");
    }

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources accessed successfully..",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
};
