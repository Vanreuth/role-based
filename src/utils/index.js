const jwt = require('jsonwebtoken')
const signJWT = (id, username,email) => {
    const accessToken = jwt.sign({
        id: id,
        username: username,
        email: email,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
    })
    const refreshToken = jwt.sign({
        id: id,
        username: username,
        email: email
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
    return { accessToken, refreshToken };
};
module.exports = { signJWT };