const { permission } = require('../middlewares');

const actions = {
  DELETE_USER: 'DELETE_USER',
  EDIT_USER: 'EDIT_USER',
  CREATE_USER: 'CREATE_USER',
  READ_USER: 'READ_USER',

  // Permission Management
    CREATE_PERMISSION: 'CREATE_PERMISSION',
    READ_PERMISSIONS: 'READ_PERMISSIONS',
    DELETE_PERMISSION: 'DELETE_PERMISSION',

    // Role Management
    CREATE_ROLE: 'CREATE_ROLE',
    READ_ROLES: 'READ_ROLES',
    UPDATE_ROLE: 'UPDATE_ROLE',
    DELETE_ROLE: 'DELETE_ROLE',
};


module.exports = { actions, roles };