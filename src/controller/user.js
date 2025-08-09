const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Get user details
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password').populate('book'); 
    res.json(user);
});
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    return res.json(users);

});

module.exports = {
    getUser,
    getAllUsers,
};