import { Router } from "express";
import { addProject, deleteProject, fetchProjects, getProject, updateProject, toggleProjectStatus } from "../controller/project.controller.js";
import { createProjectValidator, updateProjectValidator, toggleProjectStatusValidator } from "../middleware/project.validator.js";
import { upload } from "../utils/multer.js";

const router = Router()

router.route("/").post(upload.single("icon"), createProjectValidator, addProject)
router.route("/:id").put(upload.single("icon"), updateProjectValidator, updateProject)
router.route("/:id").get(getProject)
router.route("/").get(fetchProjects)
router.route("/:id").delete(deleteProject)
router.route("/toggle-status").post(toggleProjectStatusValidator, toggleProjectStatus)

export default router