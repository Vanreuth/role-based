const Order = require('../models/order');
const Cart = require('../models/cart');
const {updateInventory} = require('./productService');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (userId, orderData) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate inventory for all items
    for (const item of cart.items) {
      if (item.product.inventory.trackQuantity && 
          item.product.inventory.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${item.product.name}`);
      }
    }
    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: item.price,
      selectedVariants: item.selectedVariants
    }));

    // Calculate pricing
    const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxAmount = subtotal * 0.1; // 10% tax (you can customize this)
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + taxAmount + shippingCost;

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      payment: {
        method: orderData.paymentMethod
      },
      pricing: {
        subtotal,
        taxAmount,
        shippingCost,
        total
      }
    });

    await order.save();

    // Update inventory for all items
    for (const item of cart.items) {
      await ProductService.updateInventory(item.product._id, item.quantity);
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    return await Order.findById(order._id).populate('items.product user');
  });

  const getOrders = asyncHandler(async (userId, options = {}) => {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const paginateOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: 'items.product'
    };

    return await Order.paginate(query, paginateOptions);
  });

  const getOrderById = asyncHandler(async (orderId, userId = null) => {
    const query = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    const order = await Order.findOne(query).populate('items.product user');
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  });

  const updateOrderStatus = asyncHandler(async (orderId, status, updateData = {}) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;

    // Handle specific status updates
    if (status === 'shipped' && updateData.tracking) {
      order.tracking = {
        ...order.tracking,
        ...updateData.tracking,
        shippedAt: new Date()
      };
    }

    if (status === 'delivered') {
      order.tracking.deliveredAt = new Date();
    }

    if (status === 'cancelled') {
      order.cancellation = {
        reason: updateData.reason || 'Cancelled by admin',
        cancelledAt: new Date()
      };
    }

    await order.save();
    return await Order.findById(orderId).populate('items.product user');
  });

  const getAllOrders = asyncHandler(async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId
    } = options;

    const query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const paginateOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: 'items.product user'
    };

    return await Order.paginate(query, paginateOptions);
  });

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};