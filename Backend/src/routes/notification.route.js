import { Router } from "express";
import {
    fetchNotifications,
    getUnreadNotificationCount,
    getNotificationById,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
} from "../controller/notification.controller.js";

const router = Router();

router.get("/", fetchNotifications);
router.get("/unread/count", getUnreadNotificationCount);
router.get("/:id", getNotificationById);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);
router.delete("/delete-all", deleteAllNotifications);

export default router;
