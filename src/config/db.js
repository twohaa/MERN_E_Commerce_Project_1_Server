const mongoose = require("mongoose");

const { mongoDbUrl } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongoDbUrl, options);
    logger.log("info", "DB is connected successfully..");
    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB connection error : ", error);
    });
  } catch (error) {
    logger.log("error", "DB is not connected.. : ", error.toString());
    process.exit(1);
  }
};

module.exports = connectDB;
