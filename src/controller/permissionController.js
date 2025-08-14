
const asyncHandler = require('express-async-handler');
const {
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
} = require('../services/permissonServices.js');

const getAllPermission = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sortBy: req.query.sortBy || 'name',
    sortOrder: req.query.sortOrder || 'asc',
    search: req.query.search || '',
    resource: req.query.resource || '',
    isActive: req.query.isActive || true
  };
  const permissions = await getAllPermissions(options);
  res.json({
    message: 'Permissions retrieved successfully',
    data: permissions.docs,
    pagination: {
      page: permissions.page,
      limit: permissions.limit,
      totalDocs: permissions.totalDocs,
      hasNextPage: permissions.hasNextPage,
      hasPrevPage: permissions.hasPrevPage
    }
  });
});

const getPermissionByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const permission = await getPermissionById(id);
  if (!permission) {
    return res.status(404).json({ message: 'Permission not found' });
  }
  res.json(permission);
});
const createPermissions = asyncHandler(async (req, res) => {
  const permission = await createPermission(req.body);
  res.status(201).json(permission);
});
const updatePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const permission = await updatePermission(id, req.body);
  if (!permission) {
    return res.status(404).json({ message: 'Permission not found' });
  }
  res.json(permission);
});
const deletePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const permission = await deletePermission(id);
  if (!permission) {
    return res.status(404).json({ message: 'Permission not found' });
  }
  res.json({ message: 'Permission deleted successfully' });
});

module.exports = {
  getAllPermission,
  getPermissionByID,
  createPermissions,
  updatePermissions,
  deletePermissions
};