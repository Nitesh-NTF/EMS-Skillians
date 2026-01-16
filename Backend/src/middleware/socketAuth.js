import jwt from "jsonwebtoken";

/**
 * Socket.IO Authentication Middleware
 * Validates JWT token from socket handshake and attaches user info
 */
export const socketAuthMiddleware = (socket, next) => {
    try {
        // Get token from handshake auth or query
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
            return next(new Error("❌ Authentication error: No token provided"));
        }

        try {
            // Verify JWT
            const decoded = jwt.verify(token, process.env.SECRET);

            // Attach user info to socket
            socket.userId = decoded._id;
            socket.userRole = decoded.role;
            socket.userName = decoded.name;

            console.log(`✅ Socket authenticated for user: ${socket.userName} (${socket.userId})`);
            next();
        } catch (error) {
            return next(new Error("❌ Authentication error: Invalid or expired token"));
        }
    } catch (error) {
        return next(new Error("❌ Authentication error: " + error.message));
    }
};
