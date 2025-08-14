const express = require('express');

const router = express.Router();
const {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  getUserOrdersController,
  getOrderStatsController
} = require('../controller/orderController');
const {authenticate} = require('../middleware/auth.js');
router.post('/', authenticate, createOrderController);
router.get('/', authenticate, getOrdersController);
router.get('/:id', authenticate, getOrderByIdController);
router.get('/user', authenticate, getUserOrdersController);
router.get('/stats', authenticate, getOrderStatsController);

module.exports = router;
