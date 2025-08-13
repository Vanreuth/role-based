const express = require('express');

const router = express.Router();
const {authenticate} = require('../middleware/auth.js');
const {authorize} = require('../middleware/rbac.js')
const {createCategoryHandler} = require('../controller/categoryController.js');

router.post('/', authenticate, authorize('create_category'), createCategoryHandler);

module.exports = router;
