require("dotenv").config();

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png";
const serverPort = process.env.SERVER_PORT || 3004;
const mongoDbUrl = process.env.MONGODB_ATLAS_URL;
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "LOOSEEERR";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "LOOSEEERR";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "LOOSEEERRR";
const jwtResetPaswordKey = process.env.JWT_RESET_PASSWORD_KEY || "LOOSEEERR";
const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";

module.exports = {
  defaultImagePath,
  serverPort,
  mongoDbUrl,
  jwtActivationKey,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPaswordKey,
  smtpUserName,
  smtpPassword,
  clientUrl,
};
