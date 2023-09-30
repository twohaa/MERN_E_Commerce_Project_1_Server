const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: smtpUserName,
    pass: smtpPassword,
  },
});

const emailWithNodemailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    logger.log("info", "Message Sent : %s", info.response);
  } catch (error) {
    logger.log("error", "Error occured while sending email : ", error);
    throw error;
  }
};

module.exports = emailWithNodemailer;
