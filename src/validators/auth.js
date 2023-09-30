const { body } = require("express-validator");

//registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("User Name is required,Enter your name..")
    .isLength({ min: 3, max: 31 })
    .withMessage("User Name should be at least 3-31 characters long.."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("User Email is required,Enter your email..")
    .isEmail()
    .withMessage("Invalid User Email.."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("User Password is required,Enter your password..")
    .isLength({ min: 6 })
    .withMessage("User Password should be at least 6 characters long..")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "User Password should contain at least one uppercase letter,one lowercase letter,one number and one special character.."
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("User Address is required,Enter your address..")
    .isLength({ min: 3 })
    .withMessage("User Address should be at least 3 characters long.."),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("User Phone is required,Enter your phone.."),
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User Image is required..");
      }
      return true;
    })
    .withMessage("User Image is required.."),
];

//sign in vlidation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("User Email is required,Enter your email..")
    .isEmail()
    .withMessage("Invalid User Email.."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("User Password is required,Enter your password..")
    .isLength({ min: 6 })
    .withMessage("User Password should be at least 6 characters long..")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "User Password should contain at least one uppercase letter,one lowercase letter,one number and one special character.."
    ),
];

//update password vlidation
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old User Password is required,Enter your old password..")
    .isLength({ min: 6 })
    .withMessage("Old User Password should be at least 6 characters long..")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "User Password should contain at least one uppercase letter,one lowercase letter,one number and one special character.."
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New User Password is required,Enter your new password..")
    .isLength({ min: 6 })
    .withMessage("New User Password should be at least 6 characters long..")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "User Password should contain at least one uppercase letter,one lowercase letter,one number and one special character.."
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm User Password dosen't match..");
    }
    return true;
  }),
];

//forgot password validation
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("User Email is required,Enter your email..")
    .isEmail()
    .withMessage("Invalid User Email.."),
];

//reset password validation
const validateUserResetPassword = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("User Token is required,Enter the token.."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("User Password is required,Enter your password..")
    .isLength({ min: 6 })
    .withMessage("User Password should be at least 6 characters long..")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "User Password should contain at least one uppercase letter,one lowercase letter,one number and one special character.."
    ),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
};
