const asyncHandler = require('express-async-handler');
const {getAllRoles,getRoleById,getRoleByName,createRole,updateRole} = require('../services/roleServices.js');


const getAllRole = asyncHandler(async (req, res) => {
    const roles = await getAllRoles();
    res.json({
        message: 'Roles retrieved successfully',
        data: roles
    });
});
const getRoleByID = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
        return res.status(404).json({ message: 'Role not found' });
    }
    res.json({
        message: 'Role retrieved successfully',
        data: role
    });
});

const createRoles = asyncHandler(async (req, res) => {
      const { name, description, permissions } = req.body;

      // Check if role already exists
      const existingRole = await getRoleByName(name);
      if (existingRole) {
        return res.status(400).json({ message: 'Role already exists with this name' });
      }

      const roleData = {
        name: name.toLowerCase(),
        description,
        permissions: permissions || [],
      };

      const role = await createRole(roleData);

      res.status(201).json({
        message: 'Role created successfully',
        data: role
      });
  });
const updateRoles = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, displayName, description, permissions } = req.body;

    const role = await getRoleById(id);
    if (!role) {
        return res.status(404).json({ message: 'Role not found' });
    }

    const updatedRoleData = {
        name: name ? name.toLowerCase() : role.name,
        displayName: displayName || role.displayName,
        description: description || role.description,
        permissions: permissions || role.permissions
    };

    const updatedRole = await updateRole(id, updatedRoleData);

    res.json({
        message: 'Role updated successfully',
        data: updatedRole
    });
});

module.exports = {
  getAllRole,
  getRoleByID,
  createRoles,
  updateRoles
};