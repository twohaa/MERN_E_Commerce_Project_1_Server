const { Schema, model, default: mongoose } = require("mongoose");

// schema -> name,slug,description,price,quantity,sold,shipping,image,category
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required.."],
      trim: true,
      minlength: [3, "Minimum length of the product name should be 3..."],
      maxlength: [31, "Maximum length of the product name should be 31..."],
    },
    slug: {
      type: String,
      required: [true, "Product Slug is required.."],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required.."],
      minlength: [
        3,
        "Minimum length of the product description should be 3...",
      ],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Product price is required.."],
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props} is not a valid price,it should be greater than 0...`,
      },
    },
    quantity: {
      type: Number,
      trim: true,
      required: [true, "Product quantity is required.."],
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props} is not a valid quantity,it should be greater than 0...`,
      },
    },
    sold: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0, //shipping free
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product Image is required.."],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required.."],
    },
  },
  { timestamps: true }
);

// model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
