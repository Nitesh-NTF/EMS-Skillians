import { configDotenv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";
import { connection } from "./src/db/connection.js";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./src/middleware/socketAuth.js";
import { setupSocketHandlers } from "./src/utils/socket.js";

configDotenv();
const PORT = process.env.PORT || 4000;

connection();

cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
});

// Capture server instance and attach Socket.IO
const server = app.listen(PORT, () => {
    console.log(`Server is at http://localhost:${PORT}`);
});

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }
});

// Socket.IO authentication middleware
io.use(socketAuthMiddleware);

// Setup socket event handlers
setupSocketHandlers(io);

// Make io accessible to routes/controllers via req.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

export { io, server };
