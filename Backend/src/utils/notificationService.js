import { Notification } from "../model/notification.model.js";
import { ApiError } from "./cutomResponse.js";

/**
 * Notification Service - Handles all notification-related business logic
 * Ensures aggregation (one notification per action, even with multiple employees)
 */

export const createProjectNotification = async ({
    type,
    projectId,
    projectName,
    affectedEmployeeIds,
    triggeredBy,
    io,
    adminId
}) => {
    try {
        // Validate input
        if (!type || !projectId || !affectedEmployeeIds || affectedEmployeeIds.length === 0) {
            throw new ApiError(400, "Invalid notification parameters");
        }

        // Generate title and message based on type
        const { title, message } = generateNotificationContent(
            type,
            projectName,
            affectedEmployeeIds.length
        );

        // Create single aggregated notification
        const notification = await Notification.create({
            type,
            title,
            message,
            projectId,
            projectName,
            affectedEmployeeIds,
            triggeredBy: triggeredBy || adminId,
            recipients: [triggeredBy || adminId], // Initially only admin
            isRead: false
        });

        // Populate for response
        const populatedNotification = await Notification.findById(notification._id)
            .populate("projectId", "name")
            .populate("triggeredBy", "name email")
            .lean();

        // Emit socket event to admin room
        if (io) {
            const adminUserId = triggeredBy || adminId;
            const roomName = `user_${adminUserId}`;

            io.to(roomName).emit("notification:new", {
                ...populatedNotification,
                _id: populatedNotification._id.toString() // Convert ObjectId to string
            });

            console.log(`✅ Notification emitted to room: ${roomName}`);
        }

        return notification;

    } catch (error) {
        console.error("❌ Notification Service Error:", error.message);
        // Don't throw - API should succeed even if notification fails
        // Log the error for debugging
        return null;
    }
};

/**
 * Generate title and message based on notification type
 */
const generateNotificationContent = (type, projectName, employeeCount) => {
    const isAdded = type === "PROJECT_EMPLOYEE_ADDED";

    return {
        title: isAdded ? "Employees Added" : "Employees Removed",
        message: `${employeeCount} employee${employeeCount > 1 ? "s" : ""} ${isAdded ? "added to" : "removed from"
            } ${projectName}`
    };
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            {
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );

        return notification;
    } catch (error) {
        console.error("❌ Mark as read error:", error.message);
        throw new ApiError(500, "Failed to mark notification as read");
    }
};

/**
 * Get notifications for a user (admin only initially)
 */
export const getUserNotifications = async (userId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({
            recipients: userId
        })
            .populate("projectId", "name")
            .populate("triggeredBy", "name email")
            .populate("affectedEmployeeIds", "name email")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await Notification.countDocuments({
            recipients: userId
        });

        return {
            notifications,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("❌ Get notifications error:", error.message);
        throw new ApiError(500, "Failed to fetch notifications");
    }
};

/**
 * Get unread count for a user
 */
export const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({
            recipients: userId,
            isRead: false
        });

        return count;
    } catch (error) {
        console.error("❌ Unread count error:", error.message);
        return 0;
    }
};
