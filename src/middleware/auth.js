const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const User = require('../models/user.js');

const authenticate = async (req, res, next) => {
  try {
     const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('role');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or inactive user.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};
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



module.exports = { authenticate, verifyRefresh};