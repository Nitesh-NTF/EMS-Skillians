import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/cutomResponse.js";

export const verifyAuth = asyncHandler((req, res, next) => {
    let token;
    token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Access denied. No token provided.")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
    } catch (error) {
        next(new ApiError(401, "Access is expired."))
    }

    next();
})