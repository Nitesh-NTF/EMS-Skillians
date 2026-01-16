import { Notification } from "../model/notification.model.js";
import { ApiError, successResponse } from "../utils/cutomResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { markAsRead, getUserNotifications, getUnreadCount } from "../utils/notificationService.js";
import { isValidObjectId } from "mongoose";

/**
 * Get all notifications for logged-in user (admin)
 * Pagination supported
*/
export const fetchNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const { notifications, pagination } = await getUserNotifications(
        userId,
        parseInt(page),
        parseInt(limit)
    );

    successResponse(res, 200, "Notifications fetched successfully", {
        notifications,
        pagination
    });
});

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const count = await getUnreadCount(userId);
    successResponse(res, 200, "Unread count fetched", { unreadCount: count });
});

/**
 * Get single notification by ID
 */
export const getNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findOne({
        _id: id,
        recipients: userId
    })
        .populate("projectId", "name")
        .populate("triggeredBy", "name email")
        .populate("affectedEmployeeIds", "name email");

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    successResponse(res, 200, "Notification fetched", notification);
});

/**
 * Mark notification as read
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid notification ID");
    }

    // Verify notification belongs to user
    const notification = await Notification.findOne({
        _id: id,
        recipients: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    const updated = await markAsRead(id, userId);

    successResponse(res, 200, "Notification marked as read", updated);
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany(
        {
            recipients: userId,
            isRead: false
        },
        {
            isRead: true,
            readAt: new Date()
        }
    );

    successResponse(res, 200, "All notifications marked as read");
});

/**
 * Delete a notification
 */
export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findOneAndDelete({
        _id: id,
        recipients: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    successResponse(res, 200, "Notification deleted successfully");
});

/**
 * Delete all notifications for user
 */
export const deleteAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.deleteMany({
        recipients: userId
    });

    successResponse(res, 200, "All notifications deleted successfully");
});
