import { Notification } from "../model/notification.model.js";
import { ApiError } from "./cutomResponse.js";

/**
 * Notification Service - Handles all notification-related business logic
 * Ensures aggregation (one notification per action, even with multiple employees)
 */

export const updateEmployeeInproject = async ({
    type,
    projectId,
    projectName,
    recipients,
    triggeredBy,
    io,
}) => {
    try {
        // Validate input
        if (!type || !projectId || !recipients || recipients.length === 0) {
            throw new ApiError(400, "Invalid notification parameters");
        }

        const title = type === "PROJECT_EMPLOYEE_ADDED" ? `Employees Added to ${projectName}` : `Employees removed from ${projectName}`
        const message = `${recipients.length > 1 ? `${recipients.length} Employees are ` : "You "} ${type === "PROJECT_EMPLOYEE_ADDED" ? "added to" : "removed from"
            } ${projectName}`

        // Create single aggregated notification
        const notification = await Notification.create({
            type,
            title,
            message,
            projectId,
            recipients,
            triggeredBy: triggeredBy || adminId,
            isRead: false
        });

        // Populate for response
        const populatedNotification = await Notification.findById(notification._id)
            .populate("projectId", "name")
            .populate("triggeredBy", "name email")
            .populate("recipients", "name email")
            .lean();

        console.log('populatedNotification : ', populatedNotification)
        console.log('io',io)
        console.log('recipients', recipients)
        // Emit socket event to admin room
        if (io && recipients.length > 0) {
            console.log("if working")
            recipients.forEach(recipient => {
                const roomName = `user_${recipient}`;
                console.log('roomName', roomName)
                io.to(roomName).emit("notification:new", {
                    ...populatedNotification,
                    _id: populatedNotification._id.toString() // Convert ObjectId to string
                });
                console.log(`✅ Notification emitted to room: ${roomName}`);
            });


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
            .populate("recipients", "name email")
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
