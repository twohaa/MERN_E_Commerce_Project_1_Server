const createError = require("http-errors");
const emailWithNodemailer = require("../helper/email");

const sendEmail = async (emailData) => {
  try {
    await emailWithNodemailer(emailData);
  } catch (emailerror) {
    throw createError(500, "Failed to send verification email..");
  }
};

module.exports = sendEmail;
