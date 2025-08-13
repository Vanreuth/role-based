
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
  const permissions = await getAllPermissions();
  res.json(permissions);
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