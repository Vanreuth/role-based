
const Role = require('../models/role');
const { getAllUsers,getUserById,createUser,updateUser,deleteUser} =require("../services/userServices.js");
const asyncHandler = require('express-async-handler');

const getAllUser = asyncHandler(async (req, res) => {
        const options = {
         page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        search: req.query.search,
        role: req.query.role,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined
      };
        const result = await getAllUsers(options);
        res.json({
          message: 'Users retrieved successfully',
          data: result.docs,
          pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        } 
        })
    });
const getUserByID = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User retrieved successfully',
      data: user
    });
});
const createUsers = asyncHandler(async (req, res) => {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Convert role name to ObjectId
    let roleId;
    if (role) {
        const roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
            return res.status(400).json({ 
                message: 'Invalid role name. Available roles: admin, manager, user' 
            });
        }
        roleId = [roleDoc._id];
    } else {
        // Default to 'user' role if no role specified
        const defaultRole = await Role.findOne({ name: 'user' });
        if (!defaultRole) {
            return res.status(500).json({ message: 'Default user role not found' });
        }
        roleId = [defaultRole._id];
    }

    const user = await createUser({
        username,
        email,
        password,
        firstName,
        lastName,
        role: roleId
    });

    res.status(201).json({
        message: 'User created successfully',
        data: user
    });
});


const updateUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, firstName, lastName, role, isActive } = req.body;

  // Find the user by ID
  const user = await updateUser(id, {
    username,
    email,
    firstName,
    lastName,
    role,
    isActive
  });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    message: 'User updated successfully',
    data: user
  });
});

const deleteUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await deleteUser(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    message: 'User deleted successfully',
    data: user
  });
});

    module.exports = {
        getAllUser,
        getUserByID,
        createUsers,
        updateUsers,
        deleteUsers
 };