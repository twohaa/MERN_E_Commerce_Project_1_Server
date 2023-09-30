const { Schema, model, default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

// schema -> name,email,password,image,address,phone,isAdmin,isBanned
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required.."],
      trim: true,
      uppercase: true,
      minlength: [3, "Minimum length of the user name should be 3..."],
      maxlength: [31, "Maximum length of the user name should be 31..."],
    },
    email: {
      type: String,
      required: [true, "User Email is required.."],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email..`,
      },
    },
    password: {
      type: String,
      required: [true, "User Password is required.."],
      minlength: [3, "Minimum length of the user password should be 6..."],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "User Image is required.."],
    },
    address: {
      type: String,
      required: [true, "User Address is required.."],
      minlength: [3, "User Minimum length of the address should be 3..."],
    },
    phone: {
      type: String,
      required: [true, "User Phone is required.."],
      // validate: {
      //   validator: function (v) {
      //     return /\d{3}-\d{3}-\d{4}/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid phone number..`,
      // },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// model
const User = mongoose.model("Users", userSchema);
module.exports = User;
