const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
       type: String,
       required: true,
    },
    refreshToken: {
        type: String,
    },
    role: {
       type: String,
       enum: ["user", "admin"],
       default: "user"
    },
}, {
    // This option adds the createdAt and updatedAt fields
    timestamps: true 
});

// Create a model
const User = mongoose.model('User', userSchema);

module.exports = User;