import { body } from "express-validator";

export const createTimeEntryValidator = [
  body("project")
    .isMongoId()
    .withMessage("Valid project ID is required"),

  body("startTime")
    .isNumeric()
    .withMessage("Start time must be a number (timestamp)"),

  body("endTime")
    .isNumeric()
    .withMessage("End time must be a number (timestamp)")
    .custom((value, { req }) => {
      if (value <= req.body.startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),

  body("employee")
    .isMongoId()
    .withMessage("Valid employee ID is required"),
];

export const updateTimeEntryValidator = [
  body("date")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Date cannot be empty"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Valid project ID is required"),

  body("startTime")
    .optional()
    .isNumeric()
    .withMessage("Start time must be a number (timestamp)"),

  body("endTime")
    .optional()
    .isNumeric()
    .withMessage("End time must be a number (timestamp)")
    .custom((value, { req }) => {
      if (req.body.startTime && value <= req.body.startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),

  body("employee")
    .optional()
    .isMongoId()
    .withMessage("Valid employee ID is required"),
];