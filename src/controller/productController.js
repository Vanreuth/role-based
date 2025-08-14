const asyncHandler = require('express-async-handler');
const {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addReview,
  updateInventory
} = require('../services/productService');
const Product = require('../models/product');
const {uploadMultipleToS3} = require('../middleware/upload');
const { search } = require('../routes/product');

const createProductController = asyncHandler(async (req, res) => {
  let image = [];
  if (req.files && req.files.length > 0) {
    image = await uploadMultipleToS3(req.files);
  }
  const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      cost: parseFloat(req.body.cost),
      category: req.body.category,
      images: image, // array of URLs
      inventory: req.body.inventory ? JSON.parse(req.body.inventory) : undefined
    };
  const product = await createProduct(productData);
  res.status(201).json(product);
});
const getProductsController = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: req.query.populate || 'category'
  };
  const filters = {
    category: req.query.category,
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
    brand: req.query.brand,
    featured: req.query.featured ? req.query.featured === 'true' : undefined,
    status: req.query.status || 'active',
    search: req.query.search ? { $text: { $search: req.query.search } } : undefined,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder === 'desc' ? -1 : 1
  };

  const products = await getProducts(options, filters);
  res.status(200).json({
    message: 'Products retrieved successfully',
    data: products.docs,
    pagination:{
        page: products.page,
        limit: products.limit,
        totalPages: products.totalPages,
        totalDocs: products.totalDocs,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage
    }
  });
});

const getProductByIdController = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  res.status(200).json(product);
});

const getProductBySlugController = asyncHandler(async (req, res) => {
  const product = await getProductBySlug(req.params.slug);
  res.status(200).json(product);
});

const updateProductController = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.status(200).json(product);
});
const deleteProductController = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.status(204).send();
});

module.exports = {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
  deleteProductController
};
