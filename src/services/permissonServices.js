const Permission = require('../models/permission');
const asyncHandler = require('express-async-handler');

const createPermission = asyncHandler(async(permissionData) => {
      const permission = new Permission(permissionData);
      await permission.save();
      return permission;
  });

const getPermissionById = asyncHandler(async (id) => {
      return await Permission.findById(id);
  });

 const getPermissionByName = asyncHandler(async (name) => {
      return await Permission.findOne({ name });
  });

const getAllPermissions = asyncHandler(async (options = {}) => {
      const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        search,
        resource,
        action
      } = options;

      let query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (resource) query.resource = resource;
      if (action) query.action = action;

      const paginateOptions = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      };

      return await Permission.paginate(query, paginateOptions);
  });

  const updatePermission = asyncHandler(async (id, updateData) => {
    return await Permission.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return permission;
  });

  const deletePermission = asyncHandler(async (id) => {
    return await Permission.findByIdAndDelete(id);
  });

  const getPermissionsByResource = asyncHandler(async (resource) => {
    return await Permission.find({ resource }).sort({ name: 1 });
  });

  const getAvailableResources = asyncHandler(async () => {
    const resources = await Permission.distinct('resource');
    return resources.sort();
  });

  const getAvailableActions = asyncHandler(async () => {
    const actions = await Permission.distinct('action');
    return actions.sort();
  });

  const getPermissionsByIds = asyncHandler(async (permissionIds) => {
    return await Permission.find({ _id: { $in: permissionIds } });
  });

  const searchPermissions = asyncHandler(async (searchTerm) => {
    return await Permission.find({
      $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { displayName: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ name: 1 });
  });

module.exports = {
  createPermission,
  getPermissionById,
  getPermissionByName,
  getAllPermissions,
  updatePermission,
  deletePermission,
  getPermissionsByResource,
  getAvailableResources,
  getAvailableActions,
  getPermissionsByIds,
  searchPermissions
};