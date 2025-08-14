const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

const getCategories = asyncHandler(async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    parent = null,
    isActive = true,
    populate = 'parent subcategories',
    search = ''
  } = options;

  const query = { isActive };
  if (parent !== null) {
    query.parent = parent;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const paginateOptions = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate,
    sort
  };

  return await Category.paginate(query, paginateOptions);
});

  const getCategoryById = asyncHandler(async (id) => {
    const category = await Category.findById(id).populate('parent subcategories');
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  });

  const getCategoryBySlug = asyncHandler(async (slug) => {
    const category = await Category.findOne({ slug }).populate('parent subcategories');
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  });

  const createCategory = asyncHandler(async (categoryData) => {
    // If parent is specified, verify it exists
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
    }

    const category = new Category(categoryData);
    await category.save();
    
    return await Category.findById(category._id).populate('parent');
  });

  const updateCategory = asyncHandler(async (id, updateData) => {
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent subcategories');

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  });

  const deleteCategory = asyncHandler(async (id) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parent: id });
    if (subcategories.length > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    await Category.findByIdAndDelete(id);
    return category;
  });

  module.exports = {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
  };