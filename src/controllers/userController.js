const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("./responseContoller");
const { findWithId } = require("../services/findItem");
const { createJSONwebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clientUrl,
  jwtResetPaswordKey,
} = require("../secret");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "No user found..");

    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User is returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await findWithId(User, id, options);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User is deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required..");
    }

    if (image.size > 2 * 1024 * 1024) {
      throw createError(
        400,
        "Image size is too large,It's must be less than 2MB"
      );
    }

    const imageBufferString = image.buffer.toString("base64");

    const userExist = await checkUserExists(email);
    if (userExist) {
      throw createError(
        409,
        "User with this email has already exist,please Login.."
      );
    }

    // create jwt
    const token = createJSONwebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "10m"
    );

    // preaper email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
      <h2>Hello ${name} !</h2>
      <p>Plaese click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank"> activate your account</a></p>
      `,
    };

    // send email with nodemailer
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token Not found..");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify user..");

      const userExist = await User.exists({ email: decoded.email });
      if (userExist) {
        throw createError(409, "Email has already exist,please Login..");
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User is registered successfully..",
        // payload: user,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired..");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    // name,email,password,phone,address,image
    const allowedFields = ["name", "password", "phone", "address"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can't be updated..");
      }
    }

    const image = req.file;
    if (image) {
      //image size maximum 2mb
      if (image.size > 2 * 1024 * 1024) {
        throw createError(
          400,
          "Image size is too large,It's must be less than 2MB"
        );
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this id dosen't exist..");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User is updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);

    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User is not banned successfully..");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User is banned successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);

    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User is not unbanned successfully..");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User is unbanned successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "Old password dosen't match...");
    }

    // const filter = { userId };
    // const update = { $set: { password: newPassword } };
    // const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password is not updated successfully..");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password is updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });

    if (!userData) {
      throw createError(
        404,
        "Email is incorrect or you have not verified your email account..Please register yourself.."
      );
    }

    // create jwt
    const token = createJSONwebToken({ email }, jwtResetPaswordKey, "10m");

    // preaper email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
      <h2>Hello ${userData.name} !</h2>
      <p>Plaese click here to <a href="${clientUrl}/api/users/reset-password/${token}" target="_blank"> reset your password..</a></p>
      `,
    };

    // send email with nodemailer
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for reset your password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwtResetPaswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token..");
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password reset failed..");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password is reset successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
