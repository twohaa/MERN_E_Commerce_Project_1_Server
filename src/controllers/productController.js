const createError = require("http-errors");
const { successResponse } = require("./responseContoller");
const slugify = require("slugify");
const Product = require("../models/productModel");
const { findWithId } = require("../services/findItem");
const {
  createProductService,
  getProductsService,
  getProductService,
  deleteProductService,
  updateProductService,
} = require("../services/productService");

const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required..");
    }
    if (image.size > 2 * 1024 * 1024) {
      throw createError(
        400,
        "Image size is too large,It's must be less than 2MB"
      );
    }
    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };

    const newProduct = await createProductService(productData);

    return successResponse(res, {
      statusCode: 201,
      message: "Product is created successfully..",
      payload: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        // { email: { $regex: searchRegExp } },
        // { phone: { $regex: searchRegExp } },
      ],
    };

    const productsdata = await getProductsService(page, limit, filter);

    return successResponse(res, {
      statusCode: 201,
      message: "Products are fetched successfully..",
      payload: {
        pagination: {
          totalPages: productsdata.totalPages,
          currentPage: productsdata.currentPage,
          previousPage: productsdata.currentPage - 1,
          nextPage: productsdata.currentPage + 1,
          totalNumberOfProducts: productsdata.count,
        },
        products: productsdata.products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await getProductService(slug);

    return successResponse(res, {
      statusCode: 201,
      message: "Product is fetched successfully..",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await deleteProductService(slug);

    return successResponse(res, {
      statusCode: 201,
      message: "Product is deleted successfully..",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    // name, description, price, quantity, shipping, category
    const allowedFields = [
      "name",
      "description",
      "price",
      "quantity",
      "shipping",
      "category",
    ];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
      // else if (key === "email") {
      //   throw createError(400, "Email can't be updated..");
      // }
    }

    const image = req.file;

    const updatedProduct = await updateProductService(
      slug,
      updates,
      image,
      updateOptions
    );

    return successResponse(res, {
      statusCode: 201,
      message: "Product is updated successfully..",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
