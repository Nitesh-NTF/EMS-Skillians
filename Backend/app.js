import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {createServer} from "http"
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./src/middleware/socketAuth.js";
import { setupSocketHandlers } from "./src/utils/socket.js";
import { errorHandler } from "./src/utils/cutomResponse.js"


const app = express()

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

app.use(cors({
    origin: [
        frontendUrl
    ],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"));

// Initialize Socket.IO
export const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }
});
// console.log('io', io)
io.use(socketAuthMiddleware);

// Setup socket event handlers
setupSocketHandlers(io);

// Make io accessible to routes/controllers via req.io
app.use((req, res, next) => {
    req.io = io;
    next();
});


// Logging middleware for all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
});

// Import Routers
import authenticationRouter from "./src/routes/authentication.route.js"
import { verifyAuth } from "./src/middleware/verifyAuth.js"
import employeeRouter from "./src/routes/employee.route.js"
import projectRouter from "./src/routes/project.route.js"
import timeEntriesRouter from "./src/routes/timeEntries.route.js"
import notificationRouter from "./src/routes/notification.route.js"

// Routers
app.get("/", (req, res) => res.status(200).json({ data: "hello server http://localhost:4000" }))
app.use(authenticationRouter)
app.use("/api/employee", verifyAuth, employeeRouter)
app.use("/api/project", verifyAuth, projectRouter)
app.use("/api/time-entries", verifyAuth, timeEntriesRouter)
app.use("/api/notifications", verifyAuth, notificationRouter)


// global error handler
app.use(errorHandler)