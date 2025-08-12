const express = require('express');
const router = express.Router();
const { getUserByID,getAllUser,createUsers,updateUsers} = require("../controller/userController.js");
const {authorize} = require('../middleware/rbac.js')
const {authenticate} = require('../middleware/auth.js');
const {createUserValidator,updateUserValidator} = require('../validation/userValidation.js');
const { handleValidationErrors } = require('../middleware/validation.js');

router.use(authenticate);
router.get("/", authorize('read_users'), getAllUser);
router.get("/:id", authorize('read_users'), getUserByID);
router.post("/", authorize('create_users'), createUserValidator, handleValidationErrors, createUsers);
router.put("/:id", authorize('update_users'), updateUserValidator, handleValidationErrors, updateUsers);


module.exports = router;