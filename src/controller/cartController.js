const asyncHandler = require('express-async-handler');
const {getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart} = require('../services/cartService.js');

const addToCartController = asyncHandler(async (req, res) => {
  const {  productId, quantity, selectedVariants } = req.body;
  const userId = req.user.id;

  const cart = await addToCart(userId, productId, quantity, selectedVariants);
  res.status(201).json({
    message: 'Product added to cart successfully',
    data: cart
  });
});
const getCartController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await getCart(userId);
  res.status(200).json({
    message: 'Cart retrieved successfully',
    data: cart
  });
});
const updateCartItemController = asyncHandler(async (req, res) => {
  const { productId, quantity, selectedVariants } = req.body;
  const userId = req.user.id;

  const cart = await updateCartItem(userId, productId, quantity, selectedVariants);
  res.status(200).json({
    message: 'Cart item updated successfully',
    data: cart
  });
});

const removeFromCartController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const cart = await removeFromCart(userId, productId);
  res.status(200).json({
    message: 'Cart item removed successfully',
    data: cart
  });
});

const clearCartController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await clearCart(userId);
  res.status(200).json({
    message: 'Cart cleared successfully',
    data: cart
  });
});

module.exports = {
  addToCartController,
  getCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController
};