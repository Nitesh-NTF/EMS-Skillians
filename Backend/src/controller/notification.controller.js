import { Notification } from "../model/notification.model.js";
import { ApiError, successResponse } from "../utils/cutomResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { NOTIFICATION_FIELDS } from "../constants/notificationFields.js";
import { EMPLOYEE_FIELDS } from "../constants/employeeFields.js";
import { PROJECT_FIELDS } from "../constants/projectFields.js";


export const fetchNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, keyword = "", display = 'LIST', employeeDisplay, projectDisplay } = req.query;
    const userId = req.user._id;

    const skip = (page - 1) * limit;

    let query = {
        recipients: userId
    }
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { message: { $regex: keyword, $options: "i" } }
        ]
    }

    const notificationFields = NOTIFICATION_FIELDS[display.toUpperCase()] || NOTIFICATION_FIELDS.LIST

    let notificationQuery = Notification.find(query).select(notificationFields)

    if (employeeDisplay) {
        const empFields = EMPLOYEE_FIELDS[employeeDisplay.toUpperCase()] || EMPLOYEE_FIELDS.MINIMAL
        notificationQuery = notificationQuery.populate("triggeredBy", empFields).populate("recipients", empFields)
    }

    if (projectDisplay) {
        const projFields = PROJECT_FIELDS[projectDisplay.toUpperCase()] || PROJECT_FIELDS.MINIMAL
        notificationQuery = notificationQuery.populate("projectId", projFields)
    }

    const notifications = await notificationQuery
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

    const total = await Notification.countDocuments(query);

    const pagination = { total, page, limit, pages: Math.ceil(total / limit) }

    successResponse(res, 200, "Notifications fetched successfully", {
        notifications,
        pagination
    });
});

export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
        recipients: userId,
        isRead: false
    });

    successResponse(res, 200, "Unread count fetched", { unreadCount: count });
});

export const getNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { display = 'DETAIL', employeeDisplay = 'MINIMAL', projectDisplay = 'MINIMAL' } = req.query;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid notification ID");
    }

    const notificationFields = NOTIFICATION_FIELDS[display.toUpperCase()] || NOTIFICATION_FIELDS.DETAIL
    const empFields = EMPLOYEE_FIELDS[employeeDisplay.toUpperCase()] || EMPLOYEE_FIELDS.MINIMAL
    const projFields = PROJECT_FIELDS[projectDisplay.toUpperCase()] || PROJECT_FIELDS.MINIMAL

    const notification = await Notification.findOne({
        _id: id,
        recipients: userId
    })
        .select(notificationFields)
        .populate("projectId", projFields)
        .populate("triggeredBy", empFields)
        .populate("recipients", empFields);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Mark as read and create view record
    await Promise.all([
        Notification.findByIdAndUpdate(id, { isRead: true, readAt: new Date() })]);

    successResponse(res, 200, "Notification fetched", notification);
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findByIdAndUpdate(
        id,
        {
            isRead: true,
            readAt: new Date()
        },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }
    successResponse(res, 200, "Notification marked as read", notification);
});

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

export const deleteAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.deleteMany({
        recipients: userId
    });

    successResponse(res, 200, "All notifications deleted successfully");
});


