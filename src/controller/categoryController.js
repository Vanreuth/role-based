const {createCategory,getCategories,getCategoryById,updateCategory,deleteCategory} = require('../services/categoryService');
const asyncHandler = require('express-async-handler');
const {clearCache} = require('../middleware/cache.js');
const createCategoryHandler = asyncHandler(async (req, res) => {
    const category = await createCategory(req.body);
    await clearCache('/api/category');
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
    });
});
const getAllCategoriesHandler = asyncHandler(async (req, res) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'name',
        sortOrder: req.query.sortOrder || 'asc',
        search: req.query.search || '',
        isActive: req.query.isActive || true
    };
    const categories = await getCategories(options);
    res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories.docs,
        pagination: {
            page: categories.page,
            limit: categories.limit,
            totalDocs: categories.totalDocs,
            hasNextPage: categories.hasNextPage,
            hasPrevPage: categories.hasPrevPage
        }
    });
});
const getCategoryByIdHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category
    });
});
const updateCategoryHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await updateCategory(id, req.body);
    await clearCache(`/api/category/${id}`);
    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
    });
});
const deleteCategoryHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteCategory(id);
    await clearCache('/api/category');
    await clearCache(`/api/category/${id}`);
    res.status(204).json({
        success: true,
        message: 'Category deleted successfully'
    });
});

module.exports = {
    createCategoryHandler,
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler
};
