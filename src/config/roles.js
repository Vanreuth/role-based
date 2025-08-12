const roles = [
  {
    name: "admin",
    permissions: [
      "create_user",
      "read_user", 
      "update_user",
      "delete_user",
      "update_own_user",
      "delete_own_user",
      "create_role",
      "read_role",
      "update_role",
      "delete_role",
      "create_permission",
      "read_permission",
      "update_permission",
      "delete_permission"
    ]
  },
  {
    name: "manager",
    permissions: [
      "create_user",
      "read_user",
      "update_user",
      "delete_user",
      "update_own_user",
      "delete_own_user", 
    ]
  },
  {
    name: "user",
    permissions: [
      "read_user",
      "update_own_user",
      "delete_own_user",
    ]
  }
];

const getPermissionsByRoleName = (roleName) => {
  const role = roles.find((r) => r.name === roleName);
  return role ? role.permissions : [];
};

module.exports = {
  roles,
  getPermissionsByRoleName
};
