const {createCategory} = require('../services/categoryService');
const asyncHandler = require('express-async-handler');
const createCategoryHandler = asyncHandler(async (req, res) => {
    const category = await createCategory(req.body);
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
    });
});

module.exports = {
    createCategoryHandler
};
