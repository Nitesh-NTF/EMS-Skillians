import { validationResult } from "express-validator";
import { ApiError } from "./cutomResponse.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsgArr = errors.array().map(error => error.msg);
        next(new ApiError(400, errorMsgArr.join(", ")))
    }
    next();
};