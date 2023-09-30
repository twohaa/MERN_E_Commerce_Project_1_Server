const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("User image is deleted...");
  } catch (error) {
    console.error("User image dosen't exist");
  }
};

module.exports = { deleteImage };
