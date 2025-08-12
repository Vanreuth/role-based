const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user');
const Role = require('../models/role');
const Permission = require('../models/permission');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    console.log('Cleared existing data...');

    // === 1. Create Permissions ===
    const permissions = [
      // User management
      { name: 'create_user', displayName: 'Create User', description: 'Permission to create new users', resource: 'user', action: 'create' },
      { name: 'read_user', displayName: 'Read User', description: 'Permission to read user data', resource: 'user', action: 'read' },
      { name: 'update_user', displayName: 'Update User', description: 'Permission to update any user', resource: 'user', action: 'update' },
      { name: 'delete_user', displayName: 'Delete User', description: 'Permission to delete any user', resource: 'user', action: 'delete' },
      { name: 'update_own_user', displayName: 'Update Own User', description: 'Permission to update own user profile', resource: 'user', action: 'update_own' },
      { name: 'delete_own_user', displayName: 'Delete Own User', description: 'Permission to delete own user profile', resource: 'user', action: 'delete_own' },

      // Role management
      { name: 'create_role', displayName: 'Create Role', description: 'Permission to create new roles', resource: 'role', action: 'create' },
      { name: 'read_role', displayName: 'Read Role', description: 'Permission to read role data', resource: 'role', action: 'read' },
      { name: 'update_role', displayName: 'Update Role', description: 'Permission to update any role', resource: 'role', action: 'update' },
      { name: 'delete_role', displayName: 'Delete Role', description: 'Permission to delete any role', resource: 'role', action: 'delete' },

      // Permission management
      { name: 'create_permission', displayName: 'Create Permission', description: 'Permission to create new permissions', resource: 'permission', action: 'create' },
      { name: 'read_permission', displayName: 'Read Permission', description: 'Permission to read permissions data', resource: 'permission', action: 'read' },
      { name: 'update_permission', displayName: 'Update Permission', description: 'Permission to update any permission', resource: 'permission', action: 'update' },
      { name: 'delete_permission', displayName: 'Delete Permission', description: 'Permission to delete any permission', resource: 'permission', action: 'delete' }
    ];

    const createdPermissions = await Permission.insertMany(permissions);
    console.log('Created permissions...');

    const permissionMap = {};
    createdPermissions.forEach(p => {
      permissionMap[p.name] = p._id;
    });

    // === 2. Create Roles ===
    const roles = [
      {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Full system access',
        permissions: Object.values(permissionMap) // Admin gets all
      },
      {
        name: 'manager',
        displayName: 'Manager',
        description: 'Can manage users but not roles or permissions',
        permissions: [
          permissionMap['create_user'],
          permissionMap['read_user'],
          permissionMap['update_user'],
          permissionMap['delete_user'],
          permissionMap['update_own_user'],
          permissionMap['delete_own_user']
        ]
      },
      {
        name: 'user',
        displayName: 'User',
        description: 'Basic user profile permissions',
        permissions: [
          permissionMap['read_user'],
          permissionMap['update_own_user'],
          permissionMap['delete_own_user']
        ]
      }
    ];

    const createdRoles = await Role.insertMany(roles);
    console.log('Created roles...');

    const roleMap = {};
    createdRoles.forEach(r => {
      roleMap[r.name] = r._id;
    });

    // === 3. Create Default Users ===
    const users = [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('123456', 12),
        role: roleMap['admin']
      },
      {
        username: 'manager',
        email: 'manager@gmail.com',
        firstName: 'Manager',
        lastName: 'User',
        password: await bcrypt.hash('123456', 12),
        role: roleMap['manager']
      },
      {
        username: 'user',
        email: 'user@gmail.com',
        firstName: 'User',
        lastName: 'User',
        password: await bcrypt.hash('123456', 12),
        role: roleMap['user']
      }
    ];

    await User.insertMany(users);
    console.log('Created default users...');

    // === Final Output ===
    console.log('\nDatabase seeded successfully!');
    console.log('Login details:');
    console.log('Admin   → admin@gmail.com / 123456');
    console.log('Manager → manager@gmail.com / 123456');
    console.log('User    → user@gmail.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
