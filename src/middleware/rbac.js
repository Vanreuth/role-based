const { getPermissionsByRoleName } = require('../config/roles.js');

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      // Handle case where role is an array
      if (!req.user.role || req.user.role.length === 0) {
        return res.status(403).json({ 
          message: 'Access denied. No role assigned.',
          required: requiredPermission
        });
      }

      // Get permissions for the user's first role (you can modify this to check all roles)
      const userRole = req.user.role[0];
      const userPermissions = getPermissionsByRoleName(userRole.name);
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.',
          required: requiredPermission,
          userRole: userRole.name,
        });
      }
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Authorization error.' });
    }
  };
};

module.exports = { authorize };

