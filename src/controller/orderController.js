const { mongo } = require('mongoose');
const {createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
  getOrderStats} = require('../services/orderService');

const asyncHandler  = require('express-async-handler');
const Product = require('../models/product');
const User = require('../models/user');

const createOrderController = asyncHandler(async (req, res) => {
  const {shippingAddress, billingAddress, paymentMethod } = req.body;
  const userId = req.user.id;
  
  // Verify user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const orderData = {
    shippingAddress,
    billingAddress,
    paymentMethod
  };

  const order = await createOrder(userId, orderData);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});
const getOrdersController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await getOrders(userId);
  res.status(200).json({
    success: true,
    data: orders
  });
});
const getOrderByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await getOrderById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  res.status(200).json({
    success: true,
    data: order
  });
});
const getUserOrdersController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await getUserOrders(userId);
  res.status(200).json({
    success: true,
    data: orders
  });
});
const getOrderStatsController = asyncHandler(async (req, res) => {
  const stats = await getOrderStats();
  res.status(200).json({
    success: true,
    data: stats
  });
});

module.exports = {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  getUserOrdersController,
  getOrderStatsController
};