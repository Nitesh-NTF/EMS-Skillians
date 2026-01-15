import { Router } from "express";
import {
    createTimeEntry,
    deleteTimeEntry,
    getTimeEntries,
    getTimeEntry,
    updateTimeEntry
} from "../controller/timeEntries.controller.js";
import { createTimeEntryValidator, updateTimeEntryValidator } from "../middleware/timeEntries.validator.js";

const router = Router();

router.route("/").post(createTimeEntryValidator, createTimeEntry);
router.route("/:id").put(updateTimeEntryValidator, updateTimeEntry);
router.route("/:id").get(getTimeEntry);
router.route("/").get(getTimeEntries);
router.route("/:id").delete(deleteTimeEntry);

export default router;