const createError = require("http-errors");
const slugify = require("slugify");
const Product = require("../models/productModel");

const createProductService = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;

  const productExist = await Product.exists({ name: name });
  if (productExist) {
    throw createError(
      409,
      "product with this name has already exist,please try with different name.."
    );
  }

  const newProduct = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });

  return newProduct;
};

const getProductsService = async (page = 1, limit = 3, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  if (!products) {
    throw createError(404, "No products found...");
  }

  const count = await Product.find(filter).countDocuments();

  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const getProductService = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");

  if (!product) {
    throw createError(404, "No product found...");
  }
  return product;
};

const deleteProductService = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });

  if (!product) {
    throw createError(404, "No product found...");
  }
  return product;
};

const updateProductService = async (slug, updates, image, updateOptions) => {
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }

  if (image) {
    //image size maximum 2mb
    if (image.size > 2 * 1024 * 1024) {
      throw createError(
        400,
        "Image size is too large,It's must be less than 2MB"
      );
    }
    updates.image = image.buffer.toString("base64");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    updates,
    updateOptions
  );

  if (!updatedProduct) {
    throw createError(404, "User with this slug dosen't exist..");
  }

  return updatedProduct;
};

module.exports = {
  createProductService,
  getProductsService,
  getProductService,
  deleteProductService,
  updateProductService,
};
