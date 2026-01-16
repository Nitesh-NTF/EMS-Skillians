import { API } from "./api";

/**
 * Notification API Service
 * Handles all notification-related API calls
 */

/**
 * Fetch all notifications with pagination
 */
export const fetchNotifications = async (page = 1, limit = 10) => {
    try {
        const response = await API.get("/api/notifications", {
            params: {
                page,
                limit
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
    try {
        const response = await API.get("/api/notifications/unread/count");
        return response.data.data.unreadCount;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        throw error;
    }
};

/**
 * Get single notification by ID
 */
export const getNotificationById = async (notificationId) => {
    try {
        const response = await API.get(`/api/notifications/${notificationId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching notification:", error);
        throw error;
    }
};

/**
 * Mark single notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await API.patch(`/api/notifications/${notificationId}/read`);
        return response.data.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await API.patch("/api/notifications/read-all");
        return response.data;
    } catch (error) {
        console.error("Error marking all as read:", error);
        throw error;
    }
};

/**
 * Delete single notification
 */
export const deleteNotification = async (notificationId) => {
    try {
        const response = await API.delete(`/api/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async () => {
    try {
        const response = await API.delete("/api/notifications/delete-all");
        return response.data;
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw error;
    }
};
