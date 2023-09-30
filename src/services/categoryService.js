const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategoryService = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });

  return newCategory;
};

const getCategoriesService = async () => {
  return await Category.find({}).select("name slug").lean();
};

const getCategoryService = async (slug) => {
  return await Category.findOne({ slug }).select("name slug").lean();
};

const updateCategoryService = async (name, slug) => {
  const filter = { slug };
  const updates = { $set: { name: name, slug: slugify(name) } };
  const options = { new: true };
  const updatedCategory = await Category.findOneAndUpdate(
    filter,
    updates,
    options
  );
  return updatedCategory;
};

const deleteCategoryService = async (slug) => {
  const result = await Category.findOneAndDelete({ slug });
  return result;
};

module.exports = {
  createCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
