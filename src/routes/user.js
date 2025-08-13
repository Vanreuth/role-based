const express = require('express');
const router = express.Router();
const { getUserByID,getAllUser,createUsers,updateUsers,deleteUsers} = require("../controller/userController.js");
const {authorize} = require('../middleware/rbac.js')
const {authenticate} = require('../middleware/auth.js');
const {createUserValidator,updateUserValidator} = require('../validation/userValidation.js');
const { handleValidationErrors } = require('../middleware/validation.js');
const {upload}= require('../middleware/upload.js')
router.use(authenticate);
router.get("/", authorize('read_user'), getAllUser);
router.get("/:id", authorize('read_user'), getUserByID);
router.post("/",upload.single('avatar'), authorize('create_user'), createUserValidator, handleValidationErrors, createUsers);
router.put("/:id", upload.single('avatar'), authorize('update_user'), updateUserValidator, handleValidationErrors, updateUsers);
router.delete("/:id", authorize('delete_user'), deleteUsers);

module.exports = router;
