const Role = require('../models/role');
const Permission = require('../models/permission');
const asyncHandler = require('express-async-handler');

    const createRole = asyncHandler(async (roleData) => {
      const role = new Role(roleData);
      await role.save();
      return await Role.findById(role._id).populate('permissions');
    });

    const getRoleById = asyncHandler(async (id) => {
      return await Role.findById(id).populate('permissions');
    });

    const getRoleByName = asyncHandler(async (name) => {
    return await Role.findOne({ name }).populate('permissions');
    });

    const getAllRoles = asyncHandler(async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
        sortOrder = 'asc',
        search,
        isActive
      } = options;

      let query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (isActive !== undefined) query.isActive = isActive;

      const paginateOptions = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        populate: 'permissions'
      };

      return await Role.paginate(query, paginateOptions);
    
  });

  const updateRole = asyncHandler(async (id, updateData) => {
    return await Role.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('permissions');
  });

  const deleteRole = asyncHandler(async (id) => {
    return await Role.findByIdAndDelete(id);
  });

  const assignPermissions = asyncHandler(async (roleId, permissionIds) => {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      throw new Error('Some permissions not found');
    }

    role.permissions = permissionIds;
    await role.save();

    return await Role.findById(roleId).populate('permissions');
  });

module.exports = {
  createRole,
  getRoleById,
  getRoleByName,
  getAllRoles,
  updateRole,
  deleteRole,
  assignPermissions
};
