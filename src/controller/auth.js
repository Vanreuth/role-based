const User = require("../models/user")
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {signJWT} = require("../utils/index.js");
const signupUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
        message: "Passwords do not match",
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        role
    });
    await user.save();
    res.status(201).json({
        message: "User registered successfully",
    });
});
const loginUser = asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

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

const exchangeJWTToUser = asyncHandler(async (req, res) => {
  return res.json(req.user);
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
    signupUser,
    loginUser,
    exchangeJWTToUser,
    exchangeRefreshToken
};