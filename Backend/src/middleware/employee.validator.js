import { body } from "express-validator";

export const createEmployeeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("department")
    .optional()
    .trim(),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),

  body("role")
    .optional()
    .isArray()
    .withMessage("Role must be an array"),

  body("role.*")
    .optional()
    .isString()
    .withMessage("Each role must be a string"),
];

export const updateEmployeeValidator = [
  body("name").optional().trim().notEmpty(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("department").optional().trim(),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"]),

  body("role").optional().isArray(),

  body("role.*").optional().isString(),
];
