import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // Add new notification (from socket event)
        addNotification: (state, action) => {
            // Add to beginning of array
            state.notifications.unshift(action.payload);

            // Increment unread count if notification is not read
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },

        // Set all notifications (from API fetch)
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.isLoading = false;
        },

        // Mark single notification as read
        markAsRead: (state, action) => {
            const notificationId = action.payload;
            const notification = state.notifications.find(n => n._id === notificationId);

            if (notification && !notification.isRead) {
                notification.isRead = true;
                notification.readAt = new Date();

                // Decrement unread count
                if (state.unreadCount > 0) {
                    state.unreadCount -= 1;
                }
            }
        },

        // Mark all as read
        markAllAsRead: (state) => {
            state.notifications.forEach(notification => {
                if (!notification.isRead) {
                    notification.isRead = true;
                    notification.readAt = new Date();
                }
            });
            state.unreadCount = 0;
        },

        // Remove notification (from delete)
        removeNotification: (state, action) => {
            const notificationId = action.payload;
            const notification = state.notifications.find(n => n._id === notificationId);

            // Update unread count if removing unread notification
            if (notification && !notification.isRead && state.unreadCount > 0) {
                state.unreadCount -= 1;
            }

            state.notifications = state.notifications.filter(n => n._id !== notificationId);
        },

        // Clear all notifications
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },

        // Set unread count
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },

        // Set loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        // Set error
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    addNotification,
    setNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    setUnreadCount,
    setLoading,
    setError
} = notificationSlice.actions;

export default notificationSlice.reducer;
