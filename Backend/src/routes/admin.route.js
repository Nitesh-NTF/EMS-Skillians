import { Router } from "express";
import { getDashboardStats } from "../controller/admin.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = Router();

router.route("/dashboard-stats").get(verifyAuth, getDashboardStats);

export default router;
