const {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
  deleteProductController
} = require('../controller/productController');
const express = require('express');
const { authenticate } = require('../middleware/auth.js');
const {upload}= require('../middleware/upload.js')
const {cacheInterceptor,cacheMiddleware} = require('../middleware/cache.js')
const router = express.Router();

router.post('/', authenticate, upload.array('images'), createProductController);
router.get('/', cacheMiddleware, cacheInterceptor(30 * 60), getProductsController);
router.get('/:id', cacheMiddleware, cacheInterceptor(30 * 60), getProductByIdController);
router.get('/slug/:slug', cacheMiddleware, cacheInterceptor(30 * 60), getProductBySlugController);
router.put('/:id', authenticate, updateProductController);
router.delete('/:id', authenticate, deleteProductController);

module.exports = router;

