import { Router } from "express";
import { addEmployee, deleteEmployee, fetchEmployees, getEmployee, updateEmployee } from "../controller/employee.controller.js";
import { createEmployeeValidator, updateEmployeeValidator } from "../middleware/employee.validator.js";
import { upload } from "../utils/multer.js";

const router = Router()

router.route("/").post(upload.single("icon"),createEmployeeValidator, addEmployee)
router.route("/:id").put(upload.single("icon"),updateEmployeeValidator, updateEmployee)
router.route("/:id").get(getEmployee)
router.route("/").get(fetchEmployees)
router.route("/:id").delete(deleteEmployee)

export default router