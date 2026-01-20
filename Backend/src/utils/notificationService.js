import { Notification } from "../model/notification.model.js";
import { ApiError } from "./cutomResponse.js";


export const updateEmployeeInproject = async ({
    type,
    projectId,
    projectName,
    recipients,
    triggeredBy,
    io,
}) => {
    try {
        if (!type || !projectId || !recipients || recipients.length === 0) {
            throw new ApiError(400, "Invalid notification parameters");
        }

        const title = type === "PROJECT_EMPLOYEE_ADDED" ? `Employees Added to ${projectName}` : `Employees removed from ${projectName}`
        const message = `${recipients.length > 1 ? `${recipients.length} Employees are ` : "You "} ${type === "PROJECT_EMPLOYEE_ADDED" ? "added to" : "removed from"
            } ${projectName}`

        const notification = await Notification.create({
            type,
            title,
            message,
            projectId,
            recipients,
            triggeredBy: triggeredBy || adminId,
            isRead: false
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("projectId", "name")
            .populate("triggeredBy", "name email")
            .populate("recipients", "name email")
            .lean();

        // console.log('populatedNotification : ', populatedNotification)
        // console.log('io',io)
        // console.log('recipients', recipients)

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
        return null;
    }
};

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
