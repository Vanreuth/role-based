const User = require("../models/user.js")
const Role = require("../models/role.js");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { signJWT } = require("../utils/index.js");
const {getUserByEmail,getUserByUsername,getUserById,createUser}= require("../services/userServices.js")
const register = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword, firstName, lastName } = req.body;

    if (password !== confirmPassword) {
   return res.status(400).json({
   message: "Passwords do not match",
   });
    }

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
   return res.status(400).json({ message: 'User already exists with this email' });
      }

      const existingUsername = await getUserByUsername(username);
      if (existingUsername) {
   return res.status(400).json({ message: 'Username already taken' });
      }

      // Get default user role
      const defaultRole = await Role.findOne({ name: 'user' });
      if (!defaultRole) {
   return res.status(500).json({ message: 'Default user role not found' });
      }

   const userData = new User({
   firstName,
   lastName,
   username,
   email,
   password,
   role: [defaultRole._id]
   });

    const user = await createUser(userData);

    res.status(201).json({
   message: "User registered successfully",
   user: {
       id: user._id,
       username: user.username,
       email: user.email,
       firstName: user.firstName,
       lastName: user.lastName,
       role: user.role.map(role => ({
      id: role._id,
      name: role.name,
      description: role.description
       })),
       createdAt: user.createdAt
   }
    });
});
const loginUser = asyncHandler(async (req, res) => {
        const { username, password } = req.body;        
        // Try to find user by username first, then by email
        let user = await getUserByUsername(username);
        if (!user) {
            user = await getUserByEmail(username); // username field can contain email
        }
        
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }
    
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = signJWT(user._id, user.username, user.email);

        // save refresh token in database

        const hashedRefreshToken = await bcrypt.hash(token.refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        await user.save();
    
        res.status(200).json({
            message: "Login successful",
            token,
        });
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user._id);
    res.json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role.map(role => ({
                id: role._id,
                name: role.name,
                description: role.description
            })),
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    });
});


const exchangeRefreshToken = asyncHandler(async (req, res) => {
  // Validate Refresh Token
  const encodedToken = req.user.extract;
  const compareResult = await bcrypt.compare(
    encodedToken,
    req.user.refreshToken,
  );
  if (!compareResult) {
    return res.status(401).json('Incorrect token');
  }

  // Sign JWT Token
  const token = signJWT(req.user._id, req.user.username, req.user.email);

  // Save refresh in database

  const hashedToken = await bcrypt.hash(token.refreshToken, 10);

  const user = await User.findById(req.user._id);
  user.refreshToken = hashedToken;
  user.save();
  return res.json(token);
});


module.exports = {
    register,
    loginUser,
    getProfile,
    exchangeRefreshToken
};