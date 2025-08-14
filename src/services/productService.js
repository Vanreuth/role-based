const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (productData) => {
    // Verify category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      throw new Error('Category not found');
    }
    const product = new Product(productData);
    await product.save();
    
    return await Product.findById(product._id).populate('category');
  });

  const getProducts = asyncHandler(async (filters = {}, options = {}) => {
    const {
      category,
      minPrice,
      maxPrice,
      brand,
      featured,
      status = 'active',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const {
      page = 1,
      limit = 10,
      populate = 'category'
    } = options;

    // Build query
    const query = { status };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    if (featured !== undefined) {
      query.featured = featured;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const paginateOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate
    };

    return await Product.paginate(query, paginateOptions);
  });

  const getProductById = asyncHandler(async (id) => {
    const product = await Product.findById(id).populate('category');
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  });

  const getProductBySlug = asyncHandler(async (slug) => {
    const product = await Product.findOne({ 'seo.slug': slug }).populate('category');
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  });

  const updateProduct = asyncHandler(async (id, updateData) => {
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  });

  const deleteProduct = asyncHandler(async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  });

  const addReview = asyncHandler(async (productId, userId, reviewData) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    product.reviews.push({
      user: userId,
      ...reviewData
    });

    product.updateRating();
    await product.save();

    return await Product.findById(productId).populate('reviews.user', 'firstName lastName');
  });

  const updateInventory = asyncHandler(async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.inventory.trackQuantity) {
      if (product.inventory.quantity < quantity) {
        throw new Error('Insufficient inventory');
      }
      product.inventory.quantity -= quantity;
      await product.save();
    }

    return product;
  });

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addReview,
  updateInventory
};
