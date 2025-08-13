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
      "delete_permission",
      "create_category",
      "read_category",
      "update_category",
      "delete_category"
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
      "create_category",
      "read_category",
      "update_category",
      "delete_category"
    ]
  },
  {
    name: "user",
    permissions: [
      "read_user",
      "update_own_user",
      "delete_own_user",
      "read_category",
      "create_category",
      "update_category"
    ]
  },
  {
    name: "guest",
    permissions: [
      "read_category"
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
