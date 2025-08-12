const express = require('express');

const router = express.Router();
const {register,loginUser,getProfile} = require("../controller/authController.js")
const { registerValidator, loginValidator} = require('../validation/authvalidation.js');
const { authenticate ,verifyRefresh } = require('../middleware/auth.js');
const { handleValidationErrors } = require('../middleware/validation.js');

router.post("/signup", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, loginUser);
router.get("/profile", authenticate, getProfile);

module.exports = router;
