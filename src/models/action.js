const { permission } = require('../middlewares');

const actions = {
  DELETE_USER: 'DELETE_USER',
  EDIT_USER: 'EDIT_USER',
  CREATE_USER: 'CREATE_USER',
  READ_USER: 'READ_USER',
};

const roles = {
  ADMIN: {
    role: 'ADMIN',
    permissions: Object.keys(actions),
  },
  MANAGER: {
    role: 'MANAGER',
    permissions: [
      actions.READ_USER,
      actions.EDIT_USER,
      actions.CREATE_USER,
    ],
  },
  USER: {
    role: 'USER',
    permissions: [actions.READ_USER],
  },
};

module.exports = { actions, roles };