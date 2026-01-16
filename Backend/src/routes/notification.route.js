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

/**
 * GET /api/notifications
 * Fetch all notifications with pagination
 */
router.get("/", fetchNotifications);

/**
 * GET /api/notifications/unread/count
 * Get unread notification count
 */
router.get("/unread/count", getUnreadNotificationCount);

/**
 * GET /api/notifications/:id
 * Get single notification
 */
router.get("/:id", getNotificationById);

/**
 * PATCH /api/notifications/:id/read
 * Mark single notification as read
 */
router.patch("/:id/read", markNotificationAsRead);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch("/read-all", markAllAsRead);

/**
 * DELETE /api/notifications/:id
 * Delete single notification
 */
router.delete("/:id", deleteNotification);

/**
 * DELETE /api/notifications/delete-all
 * Delete all notifications
 */
router.delete("/delete-all", deleteAllNotifications);

export default router;
