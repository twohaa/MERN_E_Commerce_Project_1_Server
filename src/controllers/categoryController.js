const createError = require("http-errors");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const { successResponse } = require("./responseContoller");

const {
  createCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require("../services/categoryService");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await createCategoryService(name);

    return successResponse(res, {
      statusCode: 201,
      message: "Category is created successfully..",
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategoriesService();

    if (!categories) {
      throw createError(404, "Categories are not Found...");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Categories are fetched successfully..",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategoryService(slug);

    if (!category) {
      throw createError(404, "Category is not Found...");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category is fetched successfully..",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updatedCategory = await updateCategoryService(name, slug);

    if (!updatedCategory) {
      throw createError(404, "Category is not Found...");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category is updated successfully..",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await deleteCategoryService(slug);

    if (!result) {
      throw createError(404, "Category is not Found...");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category is deleted successfully..",
      payload: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
