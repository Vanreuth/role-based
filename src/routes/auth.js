const express = require('express');

const router = express.Router();
const {signupUser,loginUser,exchangeJWTToUser,exchangeRefreshToken} = require("../controller/auth.js")
const { handleValidation } = require('../middleware/error.js');
const { signupSchema, loginSchema} = require('../validation/auth.js');
const { verifyToken ,verifyRefresh } = require('../middleware/auth.js');

router.post("/signup",signupSchema, handleValidation, signupUser);
router.post("/login",loginSchema, handleValidation, loginUser);
router.get("/profile", verifyToken, exchangeJWTToUser);
router.get('/refresh', verifyRefresh, exchangeRefreshToken);
module.exports = router;