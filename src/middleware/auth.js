const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const User = require('../models/user.js');

const verifyToken = (req, res, next) => {
    // Extract token from request header from clinet
    let token = req.header("Authorization")
    if (!token) {
        return res.status(401).json({ error: "Access denied!" })
    }
    token = token.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
}
const verifyRefresh = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  const extract = token.split(' ')[1];
  const decoded = jwt.verify(extract, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  req.user = { ...user._doc, extract };
  next();
});



module.exports = { verifyToken , verifyRefresh };