const { checkSchema } = require('express-validator');

const loginSchema = checkSchema({
    username: {
        isLength: {
            options: {
                min: 2,
                max: 100
            },
            errorMessage: 'Username must be between 2 and 100 characters'
        },
    },
    password: {
        isLength: {
            options: {
                min: 5
            },
            errorMessage: 'Password must be at least 5 letters'
        },
    },
})

const signupSchema = checkSchema({
    username: {
        isLength: {
            options: {
                min: 2,
                max: 100
            },
            errorMessage: 'Name must be between 2 and 100 characters'
        },
    },
    email: {
        isEmail: true,
        errorMessage: 'Invalid email address',
    },
    password: {
        isLength: {
            options: {
                min: 5
            },
            errorMessage: 'Password must be at least 5 letters'
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }
        }
    }
})

module.exports = {
    loginSchema,
    signupSchema
};