import { io } from "socket.io-client";
import { store } from "../store/store";
import { addNotification, setUnreadCount } from "../store/notificationSlice";
import toast from "react-hot-toast";

let socket = null;

export const initializeSocket = (token) => {
    // Prevent multiple connections
    if (socket?.connected) {
        console.log("✅ Socket already connected");
        return socket;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; 
    
    socket = io(BACKEND_URL, {
        auth: {
            token: token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    // Connection event
    socket.on("connect", () => {
        console.log("🔌 Socket connected:", socket.id);
    });

    // Receive new notification
    socket.on("notification:new", (notification) => {
        console.log("🔔 New notification received:", notification);
        toast("🔔 New notification received.")
        store.dispatch(addNotification(notification));
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
    });

    // Handle connection error
    socket.on("connect_error", (error) => {
        console.error("⚠️ Socket connection error:", error.message);
    });

    // Handle authentication error
    socket.on("error", (error) => {
        console.error("⚠️ Socket error:", error);
    });

    return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected");
    }
};

/**
 * Emit mark as read event (optional, mainly handled via API)
 */
export const emitMarkAsRead = (notificationId) => {
    if (socket?.connected) {
        socket.emit("notification:read", notificationId);
    }
};
