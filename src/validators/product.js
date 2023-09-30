const { body } = require("express-validator");

//category validation
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required,Enter your product name..")
    .isLength({ min: 3, max: 31 })
    .withMessage("Product Name should be at least 3-31 characters long.."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage(
      "Product description is required,Enter your product description.."
    )
    .isLength({ min: 3 })
    .withMessage("Product description should be at least 3 characters long.."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price is required,Enter your product price..")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number.."),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required,Enter your product category.."),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required,Enter your product quantity..")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number.."),
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("Product Image is required..");
      }
      return true;
    })
    .withMessage("Product Image is required.."),
];

module.exports = {
  validateProduct,
};
