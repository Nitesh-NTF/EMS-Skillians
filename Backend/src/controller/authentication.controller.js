import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Employee } from "../model/employee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, successResponse } from "../utils/cutomResponse.js";
import { sendEmail } from "../utils/mailService.js";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await Employee.findOne({ email })
    if (!user) throw new ApiError(404, "User doesn't exists.")

    if (user.status === "Inactive") throw new ApiError(403, "Your account is inactive. Please contact administrator.")

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password")

    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRY || "1d" })
    if (!token) throw new ApiError(500, "Unable to generate token.")

    const decode = jwt.decode(token)
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })

    return successResponse(res, 200, "Login successfully.", { ...user._doc, token, expiresIn: decode.exp * 1000 })
})

export const logout = asyncHandler((req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return successResponse(res, 200, "Logout successfully.")
})

export const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await Employee.findOne({ email })

    if (!user) throw new ApiError(404, "Account not found.")

    const resetToken = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: `${process.env.FORGET_PASSWORD_TOKEN_EXPIRY}m` })

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
      <p>You requested a password reset</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in ${process.env.FORGET_PASSWORD_TOKEN_EXPIRY} minutes</p>
    `
    });

    return successResponse(res, 200, "Reset link has been sent to your email.")

})

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body

    if (!token || !password) throw new ApiError(400, "Pass token and password.")

    const decode = jwt.verify(token, process.env.SECRET)
    console.log('decode', decode)

    const user = await Employee.findOne({ email: decode.email })
    if (!user) throw new ApiError(404, "Account not found.")

    const hashPassword = await bcrypt.hash(password, 10)

    user.password = hashPassword
    user.save()

    return successResponse(res, 200, "Password reset successfully.")
})