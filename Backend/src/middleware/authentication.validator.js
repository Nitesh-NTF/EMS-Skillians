import { body } from "express-validator"
import { validate } from "../utils/validationErrorHandler.js"

export const validateLogin = [
    body("email", "Email is required").isEmail(),
    body("password").isLength({ min: 6 }),
    validate
]

export const validateForgetPassword = [
    body("email", "Email is required").isEmail(),
    validate
]

export const validateResetPassword = [
    body("token", "Token is required").notEmpty(),
    body("password").isLength({ min: 6 }),
    validate
]