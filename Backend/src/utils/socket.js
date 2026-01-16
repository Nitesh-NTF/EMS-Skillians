/**
 * Socket.IO Handlers Setup
 * Manages socket connections, room joins, and event handlers
 */

export const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.userId;
        const userRoom = `user_${userId}`;

        console.log(`\n🔌 New socket connection: ${socket.id}`);
        console.log(`👤 User ID: ${userId}`);
        console.log(`🏠 User Room: ${userRoom}`);

        // Auto-join user to their personal room
        socket.join(userRoom);
        console.log(`✅ Socket joined room: ${userRoom}`);

        // Listen for disconnect
        socket.on("disconnect", () => {
            console.log(`\n❌ Socket disconnected: ${socket.id}`);
            console.log(`👤 User ID: ${userId}`);
            console.log(`🏠 Left room: ${userRoom}`);
        });

        // Handle socket errors
        socket.on("error", (error) => {
            console.error(`⚠️ Socket error for ${userId}:`, error);
        });

        // Optional: Handle client-side events
        socket.on("notification:read", (notificationId) => {
            console.log(`📖 User ${userId} marked notification ${notificationId} as read`);
            // Handled via API route for persistence
        });
    });

    console.log("\n🌐 Socket.IO handlers initialized");
};

/**
 * Emit notification to a specific user
 * Usage: emitToUser(io, userId, 'notification:new', notificationData)
 */
export const emitToUser = (io, userId, event, data) => {
    const roomName = `user_${userId}`;
    io.to(roomName).emit(event, data);
};

/**
 * Broadcast notification to multiple users
 * Usage: broadcastNotification(io, [userId1, userId2], 'notification:new', data)
 */
export const broadcastNotification = (io, userIds, event, data) => {
    userIds.forEach(userId => {
        emitToUser(io, userId, event, data);
    });
};
