const express = require("express");
const { seedUsers, seedProducts } = require("../controllers/seedController");
const upload = require("../middlewares/uploadFile");

const seedRouter = express.Router();

// api/seed
seedRouter.get("/users", upload.single("image"), seedUsers);
seedRouter.get("/products", upload.single("image"), seedProducts);

module.exports = seedRouter;
