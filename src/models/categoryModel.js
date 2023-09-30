const { Schema, model, default: mongoose } = require("mongoose");

// schema -> name,slug
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is required.."],
      trim: true,
      unique: true,
      minlength: [3, "Minimum length of the category name should be 3..."],
      maxlength: [31, "Maximum length of the category name should be 31..."],
    },
    slug: {
      type: String,
      required: [true, "Category Slug is required.."],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// model
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
