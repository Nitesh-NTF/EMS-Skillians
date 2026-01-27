import { API } from "./api";
import { NOTIFICATION_DISPLAY_TYPES } from "../../components/constants/notificationDisplayTypes";

export const fetchNotifications = async (query) => {
    const defaults = { display: NOTIFICATION_DISPLAY_TYPES.LIST }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })

    return API.get(`/api/notifications?${urlParams.toString()}`).then(res => res.data)
};

export const getUnreadCount = async () => {
    return API.get("/api/notifications/unread/count").then(res => res.data)
};

export const getNotificationById = async (notificationId, display = NOTIFICATION_DISPLAY_TYPES.DETAIL) => {
    return API.get(`/api/notifications/${notificationId}?display=${display}`).then(res => res.data)
};

export const markNotificationAsRead = async (notificationId) => {
    return API.patch(`/api/notifications/${notificationId}/read`).then(res => res.data)
};

export const markAllNotificationsAsRead = async () => {
    return API.patch("/api/notifications/read-all").then(res => res.data)
};

export const deleteNotification = async (notificationId) => {
    return API.delete(`/api/notifications/${notificationId}`).then(res => res.data)
};

export const deleteAllNotifications = async () => {
    return API.delete("/api/notifications/delete-all").then(res => res.data)
};
