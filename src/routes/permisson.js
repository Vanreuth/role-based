const express = require('express');
const router = express.Router();
const {
    getAllPermission,
    getPermissionByID,
    createPermissions,
    updatePermissions,
    deletePermissions
} = require('../controller/permissionController.js');
const {authorize} = require('../middleware/rbac.js')
const {authenticate} = require('../middleware/auth.js');

router.use(authenticate);
router.get('/', authorize('read_permission'), getAllPermission);
router.get('/:id', authorize('read_permission'), getPermissionByID);
router.post('/', authorize('create_permission'), createPermissions);
router.put('/:id', authorize('update_permission'), updatePermissions);
router.delete('/:id', authorize('delete_permission'), deletePermissions);

module.exports = router;


