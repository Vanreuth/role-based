const express = require('express');

router = express.Router();
const {authenticate} = require('../middleware/auth.js');

const {
    addToCartController,
    getCartController,
    updateCartItemController,
    removeFromCartController,
    clearCartController
} = require('../controller/cartController');


router.get('/', authenticate, getCartController);
router.post('/', authenticate, addToCartController);
router.put('/', authenticate, updateCartItemController);
router.delete('/', authenticate, removeFromCartController);
router.delete('/', authenticate, clearCartController);

module.exports = router;


