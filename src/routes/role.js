const express = require('express');
const router = express.Router();
const {
    getAllRole,
    getRoleByID,
    createRoles,
    updateRoles
} = require('../controller/roleController.js');
const {authorize} = require('../middleware/rbac.js')
const {authenticate} = require('../middleware/auth.js');

router.use(authenticate);
router.get('/', authorize('read_role'), getAllRole);
router.get('/:id', authorize('read_role'), getRoleByID);
router.post('/', authorize('create_role'), createRoles);
router.put('/:id', authorize('update_role'), updateRoles);

module.exports = router;


