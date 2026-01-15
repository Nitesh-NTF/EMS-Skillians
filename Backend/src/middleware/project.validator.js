import { body } from "express-validator";

export const createProjectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("client")
        .trim()
        .notEmpty()
        .withMessage("Client is required"),

    body("duration")
        .optional()
        .isNumeric()
        .withMessage("Duration must be a number"),

    body("estimatedHours")
        .isNumeric()
        .withMessage("Estimated hours is required")
        .isInt({ min: 1 })
        .withMessage("Estimated hours must be at least 1"),

    body("status")
        .optional()
        .isIn(["Pending", "Active", "Inactive", "Complete"])
        .withMessage("Status must be one of: Pending, Active, Inactive, Complete"),

    body("description")
        .optional()
        .trim(),

    body("startDate")
        .isString()
        .withMessage("Valid start date is required"),

    body("endDate")
        .isString()
        .withMessage("Valid end date is required"),

    body("progressStatus")
        .optional()
        .isString()
        .withMessage("Progress status must be a string"),

    body("progressPercentage")
        .optional()
        .isNumeric()
        .withMessage("Progress percentage must be a number"),
    ,
    body("employees")
        .optional()
        .isArray()
        .withMessage("Employees must be an array"),

    body("employees.*")
        .optional()
        .isMongoId()
        .withMessage("Each employee must be a valid ObjectId"),
];

export const updateProjectValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project name cannot be empty"),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),

    body("client")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Client cannot be empty"),

    body("duration")
        .optional()
        .isNumeric()
        .withMessage("Duration must be a number"),

    body("estimatedHours")
        .optional()
        .isNumeric()
        .withMessage("Estimated hours must be a number")
        .isInt({ min: 1 })
        .withMessage("Estimated hours must be at least 1"),

    body("status")
        .optional()
        .isIn(["Pending", "Active", "Inactive", "Complete"])
        .withMessage("Status must be one of: Pending, Active, Inactive, Complete"),

    body("description")
        .optional()
        .trim(),

    body("startDate")
        .optional()
        .isString()
        .withMessage("Valid start date is required"),

    body("endDate")
        .optional()
        .isString()
        .withMessage("Valid end date is required"),

    body("progressStatus")
        .optional()
        .isString()
        .withMessage("Progress status must be a string"),

    body("progressPercentage")
        .optional()
        .isNumeric()
        .withMessage("Progress percentage must be a number"),

    body("employees")
        .optional()
        .isArray()
        .withMessage("Employees must be an array"),

    body("employees.*")
        .optional()
        .isMongoId()
        .withMessage("Each employee must be a valid ObjectId"),
];

export const toggleProjectStatusValidator = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["Pending", "Start", "In Progress", "Blocked", "Complete"])
        .withMessage("Status must be one of: Pending, Start, In Progress, Blocked, Complete"),
];
