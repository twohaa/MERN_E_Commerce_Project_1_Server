const { body } = require("express-validator");

//category validation
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required,Enter your category name..")
    .isLength({ min: 3, max: 31 })
    .withMessage("Category Name should be at least 3-31 characters long.."),
];

module.exports = {
  validateCategory,
};
