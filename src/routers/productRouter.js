const express = require("express");

const upload = require("../middlewares/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");

const productRouter = express.Router();

// api/products
productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct
);
productRouter.get("/", handleGetProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);
productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

module.exports = productRouter;
