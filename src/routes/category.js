const express = require('express');

const router = express.Router();
const {authenticate} = require('../middleware/auth.js');
const {authorize} = require('../middleware/rbac.js')
const {createCategoryHandler,getAllCategoriesHandler,getCategoryByIdHandler,updateCategoryHandler,deleteCategoryHandler} = require('../controller/categoryController.js');
const {cacheInterceptor,cacheMiddleware} = require('../middleware/cache.js')
router.post('/', authenticate, authorize('create_category'), createCategoryHandler);
router.get('/', authenticate, authorize('read_category'), cacheMiddleware, cacheInterceptor(30 * 60), getAllCategoriesHandler);
router.get('/:id', authenticate, authorize('read_category'), cacheMiddleware, cacheInterceptor(30 * 60), getCategoryByIdHandler);
router.put('/:id', authenticate, authorize('update_category'), updateCategoryHandler);
router.delete('/:id', authenticate, authorize('delete_category'), deleteCategoryHandler);

module.exports = router;