import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "./src/middleware/socketAuth.js"
import { setupSocketHandlers } from "./src/utils/socket.js"
import { errorHandler } from "./src/utils/cutomResponse.js"

const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD
].filter(Boolean);

/* =======================
   HTTP CORS
======================= */
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

/* =======================
   SOCKET.IO
======================= */
export const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
})

io.use(socketAuthMiddleware)
setupSocketHandlers(io)

/* Make io available in routes */
app.use((req, res, next) => {
    req.io = io
    next()
})

/* =======================
   Logging
======================= */
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`)
    next()
})

/* =======================
   Routes
======================= */
import authenticationRouter from "./src/routes/authentication.route.js"
import { verifyAuth } from "./src/middleware/verifyAuth.js"
import adminRoutes from "./src/routes/admin.route.js"
import employeeRouter from "./src/routes/employee.route.js"
import projectRouter from "./src/routes/project.route.js"
import timeEntriesRouter from "./src/routes/timeEntries.route.js"
import notificationRouter from "./src/routes/notification.route.js"

app.get("/", (req, res) =>
    res.status(200).json({ data: "hello server http://localhost:4000" })
)

app.use(authenticationRouter)
app.use("/api/admin", adminRoutes)
app.use("/api/employee", verifyAuth, employeeRouter)
app.use("/api/project", verifyAuth, projectRouter)
app.use("/api/time-entries", verifyAuth, timeEntriesRouter)
app.use("/api/notifications", verifyAuth, notificationRouter)

/* =======================
   Global Error Handler
======================= */
app.use(errorHandler)
