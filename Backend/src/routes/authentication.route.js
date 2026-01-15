import { Router } from "express"
import { validateForgetPassword, validateLogin, validateResetPassword } from "../middleware/authentication.validator.js"
import { forgetPassword, login, logout, resetPassword } from "../controller/authentication.controller.js"
import { verifyAuth } from "../middleware/verifyAuth.js"

const router = Router()

router.route("/login").post(validateLogin, login)
router.route("/logout").post(verifyAuth, logout)
router.route("/forget-password").post(validateForgetPassword, forgetPassword)
router.route("/reset-password").post(validateResetPassword, resetPassword)


export default router