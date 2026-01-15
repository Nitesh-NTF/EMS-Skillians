import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./src/utils/cutomResponse.js"


export const app = express()

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

// Routers
app.get("/", (req, res) => res.status(200).json({ data: "hello server http://localhost:4000" }))
app.use(authenticationRouter)
app.use("/api/employee", verifyAuth, employeeRouter)
app.use("/api/project", verifyAuth, projectRouter)
app.use("/api/time-entries", verifyAuth, timeEntriesRouter)


// global error handler
app.use(errorHandler)