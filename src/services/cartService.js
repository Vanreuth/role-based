const Cart = require('../models/cart');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

 const getCart = asyncHandler(async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    return cart;
  });

  const addToCart = asyncHandler(async (userId, productId, quantity = 1, selectedVariants = []) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.status !== 'active') {
      throw new Error('Product is not available');
    }

    // Check inventory
    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      throw new Error('Insufficient inventory');
    }

    let cart = await getCart(userId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check inventory again for updated quantity
      if (product.inventory.trackQuantity && 
          product.inventory.quantity < cart.items[existingItemIndex].quantity) {
        throw new Error('Insufficient inventory');
      }
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        selectedVariants
      });
    }

    await cart.save();
    return await Cart.findById(cart._id).populate('items.product');
  });

  const updateCartItem = asyncHandler(async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    const product = await Product.findById(item.product);
    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      throw new Error('Insufficient inventory');
    }

    item.quantity = quantity;
    await cart.save();
    
    return await Cart.findById(cart._id).populate('items.product');
  });

  const removeFromCart = asyncHandler(async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items.id(itemId).remove();
    await cart.save();
    
    return await Cart.findById(cart._id).populate('items.product');
  });

  const clearCart = asyncHandler(async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = [];
    await cart.save();
    
    return cart;
  });

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};