const jwt = require("jsonwebtoken");
const logger = require("../controllers/loggerController");

const createJSONwebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object..");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("Secret Key must be a non-empty string..");
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    logger.log("error", "Failed to sign the jwt : ", error.toString());
    throw error;
  }
};

module.exports = { createJSONwebToken };
