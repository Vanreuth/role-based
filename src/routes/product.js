const {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
  deleteProductController
} = require('../controller/productController');
const express = require('express');
const { authenticate} = require('../middleware/auth.js');
const {upload}= require('../middleware/upload.js')

const router = express.Router();

router.post('/', authenticate, upload.array('images'), createProductController);
router.get('/', getProductsController);
router.get('/:id', getProductByIdController);
router.get('/slug/:slug', getProductBySlugController);
router.put('/:id', authenticate, updateProductController);
router.delete('/:id', authenticate, deleteProductController);

module.exports = router;

