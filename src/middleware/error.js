const { validationResult } = require('express-validator');

const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        message: "Something went wrong",
        error: err.message,
    });
};
const handleValidation = (req, res, next) => {
    const result = validationResult(req)
    if (result.isEmpty()) {
        next()
    } else {
        return res.status(401).json({ error: result.array() })
    }
}

module.exports = {
    errorHandler,
    handleValidation
};
