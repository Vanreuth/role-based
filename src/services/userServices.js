const User = require('../models/user');
const Role = require('../models/role');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (userData) => {
  const user = new User(userData);
  await user.save();
  return await User.findById(user._id).populate('role');
});

const getUserById = asyncHandler(async (id) => {
  return await User.findById(id).populate('role');
});

const getUserByEmail = asyncHandler(async (email) => {
  return await User.findOne({ email }).populate('role');
});

const getUserByUsername = asyncHandler(async (username) => {
  return await User.findOne({ username }).populate('role');
});

const getAllUsers = asyncHandler(async (options = {}) => {
  const {
    page = 1,
    limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        role,
        isActive
      } = options;

      let query = {};
      
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (role) query.role = role;
      if (isActive !== undefined) query.isActive = isActive;

      const paginateOptions = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        populate: 'role'
      };

      return await User.paginate(query, paginateOptions);
  });

  const updateUser = asyncHandler(async (id, updateData) => {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('role');
  });

  const deleteUser = asyncHandler(async (id) => {
    return await User.findByIdAndDelete(id);
  });

  const changeUserRole = asyncHandler(async (userId, roleId) => {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    return await User.findByIdAndUpdate(
      userId,
      { role: roleId },
      { new: true, runValidators: true }
    ).populate('role');
  });

  const toggleUserStatus = asyncHandler(async (userId) => {
    const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.isActive = !user.isActive;
      await user.save();
      
      return await User.findById(userId).populate('role');
  });

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus
};
